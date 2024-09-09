# Github Actions Example
This repository is an example of how to deploy CDK using github actions, 
but it is also an example of how to generate release tags almost automatically.

## Useful commands
### cdk commands
* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

### uv commands 
* `uv sync`         create virtual environment and install dependencies
* `uv run pytest`   run tests
* `uv pip compile pyproject.toml -o requirements.txt` compile requirements pyproject.toml to requirements.txt