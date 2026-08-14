MockForge Backend — Master TODO / Bug / Architecture Checklist

Baseline: 13 Aug 2026
Stack: Django + DRF + SimpleJWT + SQLite/PostgreSQL + Faker
Current modules: users, projects, resources, generators, shared

0. Current Architecture Snapshot
Module	Status	Purpose
shared	🟢	UUID + audit/timestamp mixins
users	🟢 ~85%	Authentication/account lifecycle
projects	🟢 ~80%	Project CRUD + publishing
resources	🟡 ~40%	Resource + Field models exist
generators	🟡 ~60%	Generator registry + generators exist
Runtime engine	🔴	Generate actual mock API responses
Public API	🔴	/api/{project}/{resource}/
Field API	🔴	CRUD/manage resource fields
Generator API	🔴	Frontend generator metadata/options
API schema/config	🔴	Dynamic endpoint behavior
Tests	🔴	Mostly empty
Production hardening	🟡	Needs final pass
1. shared Module
Existing
 UUID primary keys
 Created/updated timestamps
 Created-by tracking
 Updated-by tracking
 Deleted-by tracking
 Soft-delete metadata
TODO
ID	Priority	Task
SH-01	🟡	Decide whether AuditMixin should automatically populate created_by / updated_by
SH-02	🟡	Define whether MockForge actually needs soft-delete or hard-delete is enough
SH-03	🟡	Add common base queryset/service utilities if required
SH-04	🟡	Standardize API error structure globally
Important architectural issue

Your mixins provide fields, but nothing currently automatically sets:

created_by
updated_by
deleted_by
deleted_at

That's not a bug if intentional, but don't assume the fields are doing auditing automatically.

2. Users / Account Module

Current state is fairly strong. 🟢

Existing
 Custom UUID user
 Username
 Email
 Password hashing
 Registration
 Login
 JWT access token
 HttpOnly refresh cookie
 Refresh
 Refresh rotation
 Token blacklist
 Logout
 Logout all
 Current user
 Profile update
 Password change
 Account deactivation
 Email verification flag
 DRF throttling
Bugs / Improvements
USR-01 — Email verification isn't actually implemented 🔴

Current:

POST /me/verify-email/

simply sets:

is_verified = True

There is no:

verification token
signed token
expiration
email
single-use protection
verification URL

Your own docstring already acknowledges this.

Fix: implement:

Register
   ↓
Generate verification token
   ↓
Send email
   ↓
User clicks link
   ↓
Verify token
   ↓
is_verified=True
USR-02 — Password reset missing 🔴

Need:

POST /auth/forgot-password/
POST /auth/reset-password/

with:

signed token
expiration
one-time usage
password validation
session revocation
USR-03 — delete_account() isn't actually deleting

Current method:

delete_account()
    ↓
is_active = False

That's deactivation, not deletion.

Either:

rename it to deactivate_account, or
implement actual account deletion.
USR-04 — deactivate_account() response contains suspicious dead code

You currently have:

return clear_refresh_cookie(response) and user

This returns the result of the boolean expression rather than cleanly returning the response.

The view should simply return the response.

USR-05 — Username/email case-insensitive uniqueness

You check with:

username__iexact
email__iexact

but DB uniqueness itself is not necessarily case-insensitive.

Potential race condition:

John
john

can potentially pass application-level validation depending on DB configuration.

Production fix: use DB-level case-insensitive uniqueness strategy.

USR-06 — Email verification should be enforced where required

You currently have:

is_verified

but authentication doesn't appear to depend on it.

Decide:

Can unverified users log in?
Can unverified users create projects?
Can unverified users publish projects?

Recommended:

Register → Login allowed
Create/publish → verification required

or enforce verification globally if SRS demands it.

3. Projects Module

Current architecture:

User
 └── Projects
       └── Resources
             └── Fields

Good foundation. 🟢

Existing
 UUID
 owner
 name
 slug
 publish state
 owner-scoped uniqueness
 CRUD
 publish
 unpublish
 toggle publish
 user isolation
Project TODO
PROJ-01 — Audit fields aren't populated 🔴

You inherit AuditMixin, but project creation doesn't pass:

created_by

and updates don't set:

updated_by

If audit tracking matters, fix this systematically.

PROJ-02 — Slug generation needs deterministic collision handling 🟡

Current:

My API
 ↓
my-api

Second project:

My API
 ↓
my-api
 ↓
400

This is technically valid, but UX could be improved.

Possible options:

my-api
my-api-2
my-api-3

or explicitly tell the user the slug is already used.

Your current explicit rejection is acceptable for v1.

PROJ-03 — Project publication rules 🔴

Need to define:

Can empty project be published?
Can resource-less project be published?
Can project with invalid generators be published?
Can unpublished resources exist inside published project?

Recommended:

Project publish
    ↓
Validate all resources
    ↓
Validate all fields
    ↓
Validate generators
    ↓
Publish
PROJ-04 — publish, unpublish, and toggle-publish

You currently have all three.

This is somewhat redundant.

Recommended public API:

POST /projects/{slug}/publish/
POST /projects/{slug}/unpublish/

Remove toggle-publish unless the frontend specifically benefits from it.

PROJ-05 — Exception handling is too broad 🟡

Views use:

except Exception

This hides programming errors.

For production:

ValidationError → 400
DoesNotExist → 404
Permission → 403
Unexpected exception → global handler / 500

Don't catch every exception inside every view.

4. Resources Module

This is where the project starts becoming MockForge.

Current state: 🟡

You have:

Projects
   ↓
Resources
   ↓
Fields

But only models are currently implemented.

5. Resource Model
Existing
 UUID
 name
 slug
 project FK
 published state
 unique project + slug
 indexes
TODO
RES-01 — Resource CRUD 🔴

Need:

GET    /projects/{project}/resources/
POST   /projects/{project}/resources/
GET    /projects/{project}/resources/{resource}/
PATCH  /projects/{project}/resources/{resource}/
DELETE /projects/{project}/resources/{resource}/
RES-02 — Resource ownership isolation 🔴

Critical security rule:

User A
 └── Project A
       └── Resource A

must never be accessible by:

User B

Even if B knows the resource slug.

RES-03 — Resource slug handling 🟡

Same considerations as projects.

products
users
orders

must be unique inside the project, not globally.

Your DB constraint already handles this.

RES-04 — Resource publish workflow 🔴

Need to determine whether:

Project published
Resource unpublished

means the resource is publicly accessible.

Recommended:

Project must be published
AND
Resource must be published
RES-05 — Resource validation before publishing 🔴

Before:

POST /resources/{slug}/publish/

validate:

name
slug
fields
generator keys
generator options
data types
duplicate field definitions
6. Fields Module

This is currently the biggest missing CRUD component.

Your model is:

Fields
├── resource
├── name
├── slug
├── description
├── data_type
├── generator_key
├── generator_options
└── display_order

That's a good v1 model.

FIELD-01 — Field CRUD 🔴

Need:

GET    /resources/{resource}/fields/
POST   /resources/{resource}/fields/
GET    /resources/{resource}/fields/{field}/
PATCH  /resources/{resource}/fields/{field}/
DELETE /resources/{resource}/fields/{field}/
FIELD-02 — Validate generator exists 🔴

Currently this is just:

generator_key = "whatever"

Database doesn't know whether it exists.

When creating a field:

generator_key
      ↓
get_generator()
      ↓
exists?
      ↓
validate_options()
      ↓
save
FIELD-03 — Validate generator/data-type compatibility 🔴

You already have:

supported_types

Example:

commerce.price
    ↓
decimal
float

Therefore:

generator = commerce.price
data_type = boolean

must fail.

This validation should happen before saving.

FIELD-04 — Validate generator options 🔴

Example:

{
  "minimum": 100,
  "maximum": 10
}

must fail.

Your generators already contain:

validate_options()

Now the model/service layer needs to actually invoke it.

FIELD-05 — Generator metadata API 🔴

Frontend needs to know available generators.

Example:

GET /generators/

Response conceptually:

[
    {
        key,
        supported_types,
        options_schema
    }
]

Your current:

list_generators()

only gives keys.

That's insufficient for a dynamic frontend.

7. Generator System

Current state: 🟡

This is actually one of the better architectural decisions you've made.

You have:

BaseGenerator
      ↓
Generator Registry
      ↓
Concrete Generators

Good.

GEN-01 — Generator discovery/import

Currently generators/__init__.py imports:

choices
commerce
datetime
internet
person
random

This works.

But make sure Django loads generators before any request attempts:

get_generator()

Otherwise registry can be empty.

GEN-02 — Generator options schema 🔴

Currently generator knows how to validate options, but frontend doesn't know what options to render.

Example:

random.integer

Frontend needs something like:

minimum → number
maximum → number

You need metadata.

GEN-03 — Generator labels 🔴

Currently:

commerce.product_name

Frontend shouldn't necessarily display the raw technical key.

Add metadata such as:

key: commerce.product_name
label: Product Name
category: Commerce
GEN-04 — Generator descriptions 🟡

Useful for frontend UX:

Generate realistic product names.
GEN-05 — Generator output type consistency 🔴

There is a mismatch here.

Example:

DateGenerator
supported_types = ("string",)

but your field model has:

date
datetime

So your generator architecture currently says:

datetime.date → string

while your schema says:

date

Those concepts need to be aligned.

Recommended:

datetime.date
    supported_types = ("date", "string")

datetime.datetime
    supported_types = ("datetime", "string")

depending on how the runtime serializes them.

GEN-06 — Decimal precision validation 🟡

Validate:

decimal_places >= 0

and sensible maximum.

GEN-07 — Boolean probability validation 🟡

Current:

true_probability

can theoretically be:

-500
999

Validate:

0 <= probability <= 100
GEN-08 — Choice picker option representation 🟡

Current:

"choices": "Apple,Banana,Orange"

Better internal representation:

{
  "choices": ["Apple", "Banana", "Orange"]
}

This avoids parsing strings everywhere.

For v1, your current implementation can work, but I'd eventually normalize it.

8. Mock Data Runtime Engine 🔴🔴🔴

This is the major missing piece.

You have generators.

You have fields.

But nothing yet connects:

HTTP Request
      ↓
Project
      ↓
Resource
      ↓
Fields
      ↓
Generator Registry
      ↓
Generated JSON

This is the heart of MockForge.

RUNTIME-01 — Runtime service

Create something conceptually like:

runtime/
    service.py

Responsible for:

generate_resource(resource, count)
RUNTIME-02 — Generate one record

Given:

Resource: products

Fields:
name → commerce.product_name
price → commerce.price
category → commerce.category

generate:

{
  "name": "Ergonomic Rubber Mouse",
  "price": 249.99,
  "category": "Electronics"
}
RUNTIME-03 — Generate multiple records

Endpoint should support something like:

GET /api/{project}/{resource}/?count=10

Response:

{
  "data": [
    {},
    {},
    {}
  ]
}

Need a maximum count.

Example:

count <= 100

to prevent abuse.

9. Public Mock API 🔴🔴🔴

This is the actual product.

Potential route:

/api/{project_slug}/{resource_slug}/

Example:

/api/shop/products/
API-01 — Public project lookup

Only:

is_published=True

projects.

API-02 — Public resource lookup

Only:

is_published=True

resources.

API-03 — No authentication

The mock endpoint should be public if the project is published.

API-04 — GET response

Initial v1:

GET

only.

Don't overbuild.

API-05 — Count parameter

Example:

?count=20

Need:

default count
maximum count
invalid count handling
API-06 — Response envelope

Define this now.

For example:

{
  "data": [
    {
      "id": "...",
      "name": "...",
      "price": 99.50
    }
  ],
  "meta": {
    "count": 1,
    "resource": "products"
  }
}

Or keep it extremely simple for v1:

[
  {}
]

Do not randomly change this later.

10. Automatic ID Generation 🔴

Your Fields currently require explicit fields.

But generated mock APIs generally need an identifier.

Decide whether every generated response automatically gets:

id

Recommended:

{
  "id": "uuid",
  "name": "..."
}

without requiring users to define it manually.

11. Generator / Field Validation Pipeline

You want exactly this:

Create Field
     ↓
Validate name
     ↓
Generate slug
     ↓
Check slug uniqueness
     ↓
Validate data_type
     ↓
Find generator
     ↓
Check supported type
     ↓
Validate generator options
     ↓
Save

This should be centralized in:

ResourceFieldService

rather than scattered across views.

12. Resource Service Layer 🔴

Currently resources don't have a service.

Create:

resources/service.py

Likely responsibilities:

get_project_resources()
get_resource()
create_resource()
update_resource()
delete_resource()
publish_resource()
unpublish_resource()

And another layer if necessary:

FieldService

for fields.

13. Serializer Architecture

Current project serializers are good enough for v1.

For resources:

ResourceListSerializer
ResourceDetailSerializer
ResourceCreateSerializer
ResourceUpdateSerializer

For fields:

FieldListSerializer
FieldDetailSerializer
FieldCreateSerializer
FieldUpdateSerializer

Don't create 15 serializers before you actually need them.

14. API URL Architecture

I'd target this structure:

/api/
│
├── auth/
│   ├── register/
│   ├── login/
│   ├── refresh/
│   ├── logout/
│   └── ...
│
├── projects/
│   └── {project_slug}/
│
├── projects/
│   └── {project_slug}/
│       └── resources/
│           └── {resource_slug}/
│               └── fields/
│
└── mock/
    └── {project_slug}/
        └── {resource_slug}/

The management API and public mock API should be clearly separated.

15. Project → Resource → Field Ownership

Critical invariant:

User
 │
 └── Project
       │
       └── Resource
             │
             └── Field

Every nested object must be validated through its parent.

Never trust:

resource_id

from the frontend.

16. Publishing Rules

I'd establish this state machine:

Project
    │
    ├── unpublished
    │
    └── published

Resource:

unpublished
    ↓
published

Public API requires:

project.is_published == True
AND
resource.is_published == True
17. Public API Security / Abuse Protection
PUB-01

Rate-limit public mock endpoints.

Otherwise someone can hit:

?count=100000000

and cook your server. 💀

PUB-02

Maximum generated records:

MAX_RECORD_COUNT

environment setting.

PUB-03

Timeout / workload protection

Avoid generators becoming expensive later.

PUB-04

No database writes during generation

Runtime generation should ideally be:

DB read configuration
        ↓
generate in memory
        ↓
return response

No generated records need to be stored in DB unless the SRS explicitly requires persistence.

18. Generator Determinism

Potential future feature:

?seed=123

Then:

same seed + same schema
=
same generated output

Not mandatory for v1.

Mark:

🟡 FUTURE

19. Pagination

Management APIs:

Projects
Resources
Fields

can use DRF pagination.

Public mock API:

Do not automatically use DRF pagination.

It's a generated API, so its response contract should be independent.

20. Filtering / Search
Projects

Could support:

?search=shop
Resources

Could support:

?search=product
Fields

Probably unnecessary initially.

Don't build useless complexity.

21. Tests 🔴

Current:

users/tests.py
projects/tests.py
resources/tests.py

are basically placeholders.

Need actual tests.

User tests
TEST-USR-01 registration
TEST-USR-02 duplicate username
TEST-USR-03 duplicate email
TEST-USR-04 password mismatch
TEST-USR-05 login
TEST-USR-06 invalid login
TEST-USR-07 refresh
TEST-USR-08 logout
TEST-USR-09 logout all
TEST-USR-10 password change
TEST-USR-11 account deactivation
Project tests
TEST-PROJ-01 create
TEST-PROJ-02 list own projects
TEST-PROJ-03 cannot see another user's project
TEST-PROJ-04 duplicate slug
TEST-PROJ-05 update
TEST-PROJ-06 delete
TEST-PROJ-07 publish
TEST-PROJ-08 unpublish
Resource tests
TEST-RES-01 create
TEST-RES-02 update
TEST-RES-03 delete
TEST-RES-04 duplicate slug
TEST-RES-05 ownership isolation
TEST-RES-06 publish
Field tests
TEST-FIELD-01 create
TEST-FIELD-02 automatic display order
TEST-FIELD-03 duplicate slug
TEST-FIELD-04 invalid generator
TEST-FIELD-05 unsupported data type
TEST-FIELD-06 invalid generator options
TEST-FIELD-07 update
TEST-FIELD-08 delete
Runtime tests
TEST-RUNTIME-01 generate string
TEST-RUNTIME-02 generate integer
TEST-RUNTIME-03 generate decimal
TEST-RUNTIME-04 generate boolean
TEST-RUNTIME-05 generate UUID
TEST-RUNTIME-06 generate date
TEST-RUNTIME-07 generate datetime
TEST-RUNTIME-08 generate multiple records
TEST-RUNTIME-09 invalid generator
TEST-RUNTIME-10 invalid options
Public API tests
TEST-PUBLIC-01 published project accessible
TEST-PUBLIC-02 unpublished project returns 404
TEST-PUBLIC-03 published resource accessible
TEST-PUBLIC-04 unpublished resource returns 404
TEST-PUBLIC-05 no authentication required
TEST-PUBLIC-06 count works
TEST-PUBLIC-07 count limit works
22. API Documentation

You're already using:

drf-spectacular

Good.

Need document:

Auth
Projects
Resources
Fields
Generators
Public Mock API

And especially the dynamic generator metadata.

23. Settings / Production

Your settings are fairly organized. 🟢

Still check:

SET-01

Move development fallback secret away from production logic.

SET-02

Production:

DEBUG=False

already enforced. Good.

SET-03

Production database PostgreSQL.

SET-04

Configure:

CSRF_TRUSTED_ORIGINS

when required by deployment topology.

SET-05

Configure media storage.

Currently:

FileSystemStorage

works locally but isn't ideal for production platforms with ephemeral filesystems.

24. CORS / Cookie Architecture

You have:

CORS_ALLOW_CREDENTIALS = True

and HttpOnly refresh cookies.

Good.

But production must ensure:

CORS_ALLOWED_ORIGINS

contains the exact frontend origin.

No wildcard with credentials.

25. Database Migration

Current:

SQLite

for development.

Production:

PostgreSQL

Good.

Before deployment:

makemigrations
migrate
createsuperuser
collectstatic

and test against PostgreSQL locally.

26. Admin

Currently admin files exist but likely need completion.

Useful admin:

User
Project
Resource
Field

Especially:

Field.generator_key
Field.generator_options

for debugging.

27. Code Quality
CQ-01 — Remove unnecessary docstrings/comments only where excessive

Your code is generally readable.

CQ-02 — Avoid f-string logging

Instead of:

logger.info(f"...")

prefer logging's lazy formatting:

logger.info("...", value)
CQ-03 — Don't use except Exception everywhere

Already mentioned. Important.

CQ-04 — Run Ruff

You already have:

.ruff_cache

So make Ruff part of the development workflow.

28. Missing Application Structure

Eventually your backend should roughly evolve toward:

server/
│
├── config/
│
├── users/
│
├── projects/
│
├── resources/
│
├── generators/
│
├── runtime/
│   ├── __init__.py
│   ├── service.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── shared/
│
└── manage.py

Don't create everything immediately.

29. Recommended Implementation Order

This is the important part.

Don't randomly jump between files.

Follow this sequence:

Phase 1 — Finish Resource Management
1. Resource service
2. Resource serializers
3. Resource ViewSet
4. Resource URLs
5. Resource ownership validation
6. Resource publish/unpublish
Phase 2 — Finish Field Management
7. Field service
8. Field serializers
9. Field ViewSet
10. Nested resource/field routing
11. Generator validation
12. Generator option validation
13. Display ordering
Phase 3 — Fix Generator Architecture
14. Generator metadata
15. Generator labels
16. Generator descriptions
17. Option schemas
18. Data-type compatibility
19. Date/datetime type consistency
20. Boolean probability validation
Phase 4 — Build Runtime
21. Runtime service
22. Generate one object
23. Generate N objects
24. Automatic ID
25. Serialization
26. Error handling
Phase 5 — Public Mock API
27. Public project lookup
28. Public resource lookup
29. Public endpoint
30. count parameter
31. count limit
32. publication validation
33. public throttling
Phase 6 — Testing
34. Generator tests
35. Field tests
36. Resource tests
37. Project tests
38. Runtime tests
39. Public API tests
40. Security/ownership tests
Phase 7 — Production
41. PostgreSQL test
42. Static/media
43. CORS
44. CSRF
45. Environment validation
46. logging
47. deployment
30. The Most Important Architectural Flow

This is the architecture we should protect while continuing:

                    ┌──────────────┐
                    │     User     │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Project    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Resource   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Field     │
                    │              │
                    │ data_type    │
                    │ generator    │
                    │ options      │
                    └──────┬───────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Generator Registry │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Runtime Generator │
                 └─────────┬─────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Generated JSON  │
                  └────────┬────────┘
                           │
                           ▼
             GET /api/{project}/{resource}/

That is the product. Everything else supports that flow.

Current Priority Board
Priority	Work	Status
🔴 P0	Resource CRUD	Next
🔴 P0	Field CRUD	Next
🔴 P0	Generator validation	Next
🔴 P0	Generator metadata	Next
🔴 P0	Runtime engine	Not started
🔴 P0	Public Mock API	Not started
🟠 P1	Resource publishing	Pending
🟠 P1	Project publishing validation	Pending
🟠 P1	Runtime tests	Pending
🟠 P1	Ownership/security tests	Pending
🟡 P2	Password reset	Pending
🟡 P2	Real email verification	Pending
🟡 P2	Admin improvements	Pending
🟡 P2	Production storage	Pending
🟢 P3	Seed support	Future
🟢 P3	API customization	Future
🟢 P3	Faker determinism	Future
🟢 P3	Advanced generators	Future