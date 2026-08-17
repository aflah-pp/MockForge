import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getGenerators } from "@/service/endpoints/fields";

const fieldSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Field name is required.")
    .max(100, "Field name must be 100 characters or less."),

  description: z.string().max(500, "Description must be 500 characters or less."),

  generator_key: z.string().min(1, "Generator is required."),

  generator_options: z.record(z.string(), z.any()),

  display_order: z.coerce
    .number()
    .int("Display order must be a whole number.")
    .min(0, "Display order cannot be negative."),
});

function normalizeGenerators(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
}

function getOptionDescription(optionKey) {
  const descriptions = {
    minimum: "Smallest value that can be generated.",
    maximum: "Largest value that can be generated.",
    decimal_places: "Number of digits after the decimal point.",
    true_probability: "Percentage chance that the generated value will be true.",
    domain: "Optional domain used when generating the email address.",
    start: "Starting point of the generation range.",
    end: "Ending point of the generation range.",
    words: "Number of words generated in the sentence.",
    sentences: "Number of sentences generated in the paragraph.",
    choices: "Values that can be randomly selected.",
  };

  return descriptions[optionKey] ?? "";
}

function getOptionType(option) {
  if (option.type === "number") {
    return "number";
  }

  if (
    option.key === "minimum" ||
    option.key === "maximum" ||
    option.key === "decimal_places" ||
    option.key === "true_probability" ||
    option.key === "words" ||
    option.key === "sentences"
  ) {
    return "number";
  }

  if (option.key === "start" || option.key === "end") {
    return "date";
  }

  return "text";
}

function getOptionDefault(option) {
  if (option.default !== undefined && option.default !== null) {
    return option.default;
  }

  if (option.default_value !== undefined && option.default_value !== null) {
    return option.default_value;
  }

  return "";
}

function normalizeOptionValue(value, type) {
  if (type === "number") {
    return value === "" ? "" : Number(value);
  }

  return value;
}

export default function FieldForm({
  mode = "create",
  initialData = null,
  onSubmit,
  isSubmitting = false,
}) {
  const isEdit = mode === "edit";

  const [choices, setChoices] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      name: "",
      description: "",
      generator_key: "",
      generator_options: {},
      display_order: 0,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const generatorKey = watch("generator_key");

  const generatorOptions = watch("generator_options") || {};

  const generatorsQuery = useQuery({
    queryKey: ["generators"],
    queryFn: getGenerators,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const generators = useMemo(
    () => normalizeGenerators(generatorsQuery.data),
    [generatorsQuery.data],
  );

  const selectedGenerator = useMemo(
    () => generators.find((generator) => generator.key === generatorKey) ?? null,
    [generators, generatorKey],
  );

  const generatorOptionsConfig = selectedGenerator?.options ?? [];

  const isChoiceGenerator = selectedGenerator?.key === "choice.picker";

  useEffect(() => {
    if (!initialData) {
      reset({
        name: "",
        description: "",
        generator_key: "",
        generator_options: {},
        display_order: 0,
      });

      setChoices([]);

      return;
    }

    const initialOptions = initialData.generator_options ?? {};

    reset({
      name: initialData.name ?? "",
      description: initialData.description ?? "",
      generator_key: initialData.generator_key ?? "",
      generator_options: initialOptions,
      display_order: initialData.display_order ?? 0,
    });

    if (initialData.generator_key === "choice.picker" && Array.isArray(initialOptions.choices)) {
      setChoices(initialOptions.choices);
    } else {
      setChoices([]);
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (!selectedGenerator || !isChoiceGenerator) {
      return;
    }

    const existingChoices = Array.isArray(generatorOptions.choices) ? generatorOptions.choices : [];

    setChoices(existingChoices);
  }, [generatorOptions.choices, selectedGenerator, isChoiceGenerator]);

  const handleGeneratorChange = (value) => {
    const generator = generators.find((item) => item.key === value);

    setValue("generator_key", value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (!generator) {
      setValue(
        "generator_options",
        {},
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );

      setChoices([]);

      return;
    }

    const options = {};

    generator.options?.forEach((option) => {
      options[option.key] = getOptionDefault(option);
    });

    if (generator.key === "choice.picker") {
      options.choices = [];
      setChoices([]);
    }

    setValue("generator_options", options, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleOptionChange = (key, value, type) => {
    const parsedValue = normalizeOptionValue(value, type);

    setValue(
      "generator_options",
      {
        ...generatorOptions,
        [key]: parsedValue,
      },
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const handleAddChoice = () => {
    const updatedChoices = [...choices, ""];

    setChoices(updatedChoices);

    setValue(
      "generator_options",
      {
        ...generatorOptions,
        choices: updatedChoices,
      },
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...choices];

    updatedChoices[index] = value;

    setChoices(updatedChoices);

    setValue(
      "generator_options",
      {
        ...generatorOptions,
        choices: updatedChoices,
      },
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const handleRemoveChoice = (index) => {
    const updatedChoices = choices.filter((_, choiceIndex) => choiceIndex !== index);

    setChoices(updatedChoices);

    setValue(
      "generator_options",
      {
        ...generatorOptions,
        choices: updatedChoices,
      },
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const submitForm = (data) => {
    if (!selectedGenerator) {
      return;
    }

    const options = {
      ...data.generator_options,
    };

    if (isChoiceGenerator) {
      options.choices = choices.map((choice) => choice.trim()).filter(Boolean);

      if (!options.choices.length) {
        return;
      }
    }

    onSubmit({
      name: data.name.trim(),
      description: data.description.trim(),
      generator_key: data.generator_key,
      generator_options: options,
      display_order: Number(data.display_order),
    });
  };

  const formDisabled = isSubmitting || generatorsQuery.isLoading;

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Field Name</Label>

        <Input
          id="name"
          placeholder="First Name"
          autoComplete="off"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />

        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}

        <p className="text-xs text-muted-foreground">The name users will see for this field.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>

        <Textarea
          id="description"
          placeholder="A person's first name"
          disabled={isSubmitting}
          {...register("description")}
        />

        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}

        <p className="text-xs text-muted-foreground">
          Optional information describing what this field represents.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Generator</Label>

        <Select value={generatorKey} disabled={formDisabled} onValueChange={handleGeneratorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a generator" />
          </SelectTrigger>

          <SelectContent>
            {generators.map((generator) => (
              <SelectItem key={generator.key} value={generator.key}>
                {generator.key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.generator_key && (
          <p className="text-sm text-destructive">{errors.generator_key.message}</p>
        )}

        {generatorsQuery.isLoading && (
          <p className="text-xs text-muted-foreground">Loading generators...</p>
        )}

        {generatorsQuery.isError && (
          <p className="text-sm text-destructive">
            {generatorsQuery.error?.response?.data?.detail || "Failed to load generators."}
          </p>
        )}

        {selectedGenerator && (
          <div className="rounded-lg border bg-muted/30 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">{selectedGenerator.key}</p>

              <span className="rounded-md border bg-background px-2 py-1 font-mono text-[11px] text-muted-foreground">
                {selectedGenerator.supported_types?.join(", ")}
              </span>
            </div>

            {selectedGenerator.description && (
              <p className="mt-1 text-xs text-muted-foreground">{selectedGenerator.description}</p>
            )}
          </div>
        )}
      </div>

      {selectedGenerator && isChoiceGenerator && (
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium">Available Choices</h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Add the values that can be returned by this field.
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isSubmitting}
              onClick={handleAddChoice}
            >
              <Plus className="mr-2 size-4" />
              Add Choice
            </Button>
          </div>

          {choices.length === 0 ? (
            <div className="rounded-md border border-dashed px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">No choices added yet.</p>

              <Button
                type="button"
                variant="link"
                size="sm"
                disabled={isSubmitting}
                onClick={handleAddChoice}
              >
                Add your first choice
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {choices.map((choice, index) => (
                <div key={`choice-${index}`} className="flex items-center gap-2">
                  <Input
                    value={choice}
                    placeholder={`Choice ${index + 1}`}
                    disabled={isSubmitting}
                    onChange={(event) => handleChoiceChange(index, event.target.value)}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isSubmitting}
                    onClick={() => handleRemoveChoice(index)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedGenerator && !isChoiceGenerator && generatorOptionsConfig.length > 0 && (
        <div className="space-y-4 rounded-lg border p-4">
          <div>
            <h3 className="text-sm font-medium">Generator Options</h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Configure how this generator should create values.
            </p>
          </div>

          {generatorOptionsConfig.map((option) => {
            const optionType = getOptionType(option);

            return (
              <div key={option.key} className="space-y-2">
                <Label htmlFor={`option-${option.key}`}>{option.label || option.key}</Label>

                <Input
                  id={`option-${option.key}`}
                  type={optionType}
                  min={option.min ?? undefined}
                  max={option.max ?? undefined}
                  placeholder={option.placeholder ?? undefined}
                  value={generatorOptions[option.key] ?? ""}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    handleOptionChange(option.key, event.target.value, optionType)
                  }
                />

                {getOptionDescription(option.key) && (
                  <p className="text-xs text-muted-foreground">
                    {getOptionDescription(option.key)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedGenerator && !isChoiceGenerator && generatorOptionsConfig.length === 0 && (
        <div className="rounded-lg border bg-muted/30 px-4 py-3">
          <p className="text-sm font-medium">No configuration required</p>

          <p className="mt-1 text-xs text-muted-foreground">
            This generator works without any additional options.
          </p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            isSubmitting ||
            generatorsQuery.isLoading ||
            generatorsQuery.isError ||
            (isEdit && !isDirty) ||
            !generatorKey ||
            !selectedGenerator ||
            (isChoiceGenerator && !choices.some((choice) => choice.trim()))
          }
        >
          {isSubmitting
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
              ? "Save Changes"
              : "Create Field"}
        </Button>
      </div>
    </form>
  );
}
