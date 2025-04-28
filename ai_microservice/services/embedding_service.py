

def cosine_similarity(a, b):
    """
    Calculate the cosine similarity between two vectors.
    """
    dot_product = sum(x * y for x, y in zip(a, b))
    norm_a = sum(x ** 2 for x in a) ** 0.5
    norm_b = sum(y ** 2 for y in b) ** 0.5
    return dot_product / (norm_a * norm_b) if norm_a and norm_b else 0.0