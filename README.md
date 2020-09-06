# Generators

Quickly generate boilerplate files or code for various projects and tasks.

## Usage

1. Make sure [hygen](https://www.hygen.io/docs/quick-start) is installed.

2. Copy the generators into your project. You will need to copy the `_templates` folder and the `.hygen.js` configuration file in this repo. There are many ways you can do this, here are a couple:

    - Clone into a new project:

        ```bash
        git clone https://github.com/brikcss/generators <project name> && rm -rf <project name>/.git
        ```

    - Copy into an existing project:

        ```bash
        # OPTIONAL: Remove existing generators if you want to start fresh:
        rm -rf _templates
        # Copy generators:
        git clone https://github.com/brikcss/generators .generators && cp -R .generators/{_templates,.hygen.js} . && rm -rf .generators
        ```

    - Manually [download this repo](https://github.com/brikcss/generators/archive/master.zip) and copy generators (`_templates`) and configuration (`.hygen.js`) into your project.

3. (optional) Update your root `package.json` with your project details to inform generators. You may also want to remove `README.md`. _Note: You may skip this step, in which case you will be prompted for additional information._

4. Run a generator:

    ```bash
    hygen <generator> <action>
    ```

## Available generators

See [hygen](https://www.hygen.io/) for full details on using generators.

### `project`

-   `hygen project new`: Generate a new project. The generator will look first in `package.json`, and prompt you for any other needed information.
