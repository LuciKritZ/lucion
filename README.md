# Lucion

[Lucion](https://lucion.vercel.app/) is a team workspace inspired by [Notion](https://www.notion.so/). A connected workspace for better, efficient, and faster work. It is created by [LuciKritZ](https://github.com/LuciKritZ). Lucion is based on the following technologies:

1. [Next.js 14](https://github.com/vercel/next.js)
2. [Tailwind CSS](https://tailwindcss.com/)
3. [Clerk](https://clerk.com/)
4. [Convex](https://www.convex.dev/)
5. [Edgestore](https://edgestore.dev/)

## Getting Started

### Local Machine

1. Have both [npm](https://www.npmjs.com/) and [node](https://nodejs.org/en/) installed

2. Run `npm install` to install dependencies

3. Run `npx convex dev`

   - This will start a convex backend.
   - For more information on Convex, refer this [README.md](convex/README.md)

4. Run `npm run dev` in a separate terminal
   - This will start the development server.

## Typescript

This project is developed completely in TypeScript.

[Crash course](https://www.youtube.com/watch?v=1jMJDbq7ZX4)

## Engines

Consult the `"engines"` section of package.json for the recommended version of **node**, and **npm**.

### What if my node or npm version is not accepted?

- Compatible versions of node and npm are tightly coupled; if one or the other is not compatible, run: `nvm install`.

<!-- TODO -->
<!-- ## Release Notes [In Progress]

See [Deployments](https://github.com/LuciKritZ/lucion/deployments) -->

## Environment Variables in Use Today

The application currently has 6 environment variables:

1. `CONVEX_DEPLOYMENT`

   - **What it is**: A Convex deployment variable provided by Convex itself.
   - **Where it comes from**: [Convex](https://convex.dev) -> Login -> Project -> Project Settings or after you create a project in Convex.
   - **Be advised**: There must NOT be a terminating slash (`/`) at the end of this value.

2. `NEXT_PUBLIC_CONVEX_URL`

   - **What it is**: A Convex deployment variable provided by Convex itself.
   - **Where it comes from**: [Convex](https://convex.dev) -> Login -> Project -> Project Settings or after you create a project in Convex.

3. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

   - **What it is**: This is a Clerk key which should is used in the frontend code, can be safely shared, and does not need to be kept secret. [Reference](providers/convex.provider.tsx)
   - **Where it comes from**: [Clerk](https://clerk.com) -> Login -> Dashboard -> [Your Application] -> API Keys

4. `CLERK_SECRET_KEY`

   - **What it is**: This is the secret key for Clerk which is supposed to be used from our backend code. It's very sensitive and should be deleted if leaked.
   - **Where it comes from**: [Clerk](https://clerk.com) -> Login -> Dashboard -> [Your Application] -> API Keys

5. `EDGE_STORE_ACCESS_KEY`

   - **What it is**: This is an edgestore variable access key.
   - **Where it comes from**: [Edgestore](https://edgestore.dev) -> Login -> Dashboard -> Project -> Info icon -> Project Keys

6. `EDGE_STORE_SECRET_KEY`

   - **What it is**: This is an edgestore variable secret key.
   - **Where it comes from**: [Edgestore](https://edgestore.dev) -> Login -> Dashboard -> Project -> Info icon -> Project Keys

## Shout out t0

[Code with Antonio](https://www.codewithantonio.com/) for an excellent tutorial on youtube. I really appreciate it what he's doing for the community. <3
