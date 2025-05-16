# PyCon India 2025 Website

This repository contains the source code for the PyCon India 2025 website, built with [11ty](https://www.11ty.dev/) and [Tailwind CSS](https://tailwindcss.com/).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v22 or latest)
- npm

### Setup

1. Fork and clone the repository:
   ```sh
   git clone https://github.com/pythonindia/inpycon2025.git
   cd inpycon2025
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run serve
   ```

4. Open your browser and visit `http://localhost:8080`

## Contributing Guidelines

We welcome contributions from everyone! Here's how you can help:

### 1. Find or Create an Issue

- Check the [issues page](https://github.com/pythonindia/inpycon2025/issues) for existing tasks
- Feel free to create a new issue if you find a bug or want to suggest an enhancement
- Wait for issue assignment before starting work to avoid duplicate efforts

### 2. Development Workflow

1. Create a new branch for your changes:
   ```sh
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our code style (see below)

3. Commit your changes with meaningful messages:
   ```sh
   git commit -m "Add: description of what you've added"
   git commit -m "Fix: description of what you've fixed"
   git commit -m "Update: description of what you've updated"
   ```

4. Push your changes:
   ```sh
   git push origin feature/your-feature-name
   ```

5. Create a pull request from your branch to the main repository

### 3. Code Structure

- `src/`: Source files
  - `_data/`: Global data files
  - `_includes/`: Template partials and components
  - `_layouts/`: Page templates
  - `css/`: CSS source files
  - `static/`: Static assets (images, css libraries, etc.)

### 4. Component System

We use a component-based approach with Nunjucks templates:

- **Components**: Reusable UI elements in `src/_includes/components/`
- **Layouts**: Page templates in `src/_layouts/`
- **Partials**: Reusable page sections in `src/_includes/`

#### Creating a New Component

1. Add your component in `src/_includes/components/your-component.njk`. If your component is limited to a page, add it under that page directory. Keep codebase as modular and reusable as you can.
2. Use the following template:

```njk
{% macro componentName(param1, param2) %}
<div class="your-class-names">
  {{ param1 }}
  {% if param2 %}
    <span>{{ param2 }}</span>
  {% endif %}
  {{ caller() if caller }}
</div>
{% endmacro %}
```

3. Import and use your component in pages:

```njk
{% from "components/your-component.njk" import componentName %}
{{ componentName("value1", "value2") }}
```

### 5. Styling Guidelines

We use Tailwind CSS for styling:

- Use Tailwind utility classes whenever possible
- Custom CSS should be minimal and placed in `src/css/main.css`
- Follow the established color scheme and design system:
  - Primary colors: `pycon-blue` (#4E62F5), `pycon-lime` (#D7FF7B), `pycon-purple` (#CD89FF)
  - Use responsive classes (`md:`, `lg:`, etc.) for different screen sizes

### 6. Testing Your Changes

- Ensure your changes look good on different screen sizes (mobile, tablet, desktop)
- Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- Check performance using Lighthouse in Chrome DevTools

### 7. Pull Request Process

1. Ensure your code follows our style guidelines
2. Update the README.md with details of changes if necessary
3. The PR should work in all browsers and device sizes
4. Request reviews from maintainers
5. Address any review comments and make necessary changes
6. Once approved, a maintainer will merge your PR
7. Add screenshots if necessary

### 8. Deployment

- The site is automatically deployed on Netlify
- Preview deployments are generated for pull requests
- Always check the preview deployment link to verify your changes
- If for any reason, you don't see any preview, contact one of the maintainers

## Project Architecture

### Eleventy Configuration

The site uses Eleventy (11ty) as a static site generator. Key configuration:

- `env.js`: Environment-specific configuration
- `site.json`: Global site metadata
- Nunjucks as the primary templating language

### Tailwind Configuration

_Note: To be revised once [Tailwind v4 update](https://github.com/pythonindia/inpycon2025/issues/23) is done._

Tailwind CSS is configured in `tailwind.config.js`:

- Custom colors for the PyCon India brand
- Extended animations and utilities
- JIT mode for development
- Purging unused CSS in production

### CI/CD

- Continuous Integration through GitHub Actions
- Continuous Deployment through Netlify

## Need Help?

If you need any help or have questions:

1. Join our [Zulip/Whatsapp chat platform]
2. Ask in the comments of the issue you're working on
3. Email the PyCon India organizers at [contact@in.pycon.org]

Thank you for contributing to PyCon India 2025!
