# Python Project with uv
---

## commands
### Create a virtual environment.
[Reference](https://docs.astral.sh/uv/reference/cli/#uv-venv)

```bash
uv venv -p python3.12
```

### Locking requirements
[Reference](https://docs.astral.sh/uv/pip/compile/#locking-requirements)
```bash
uv pip compile pyproject.toml -o requirements.txt
```