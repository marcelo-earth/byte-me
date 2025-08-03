# ByteMe

Compare tokenization strategies: byte-level vs BPE vs WordPiece vs Unigram.

Part of the [LLM Experiments Portfolio](https://github.com/marcelo-earth/twenty-llms).

## What is this?

Tokenizers turn text into numbers. There are 4 main ways to do it. This project loads each one and compares them side by side on the same text.

## Tokenizers compared

| Strategy | Used by | How it works |
|----------|---------|-------------|
| Byte-level BPE | GPT-4, Llama | Starts from bytes, merges frequent pairs |
| BPE | Most modern LLMs | Starts from characters, merges frequent pairs |
| WordPiece | BERT | Similar to BPE but uses likelihood instead of frequency |
| Unigram | T5, XLNet | Starts big, removes tokens that hurt the least |

## Setup

```bash
pip install -r requirements.txt
```

## Run

Open `byteme.ipynb` in Jupyter or run on [Kaggle](https://kaggle.com).
