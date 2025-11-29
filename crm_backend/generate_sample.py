import json

data = []
for i in range(1, 31):
    data.append({
        "model": "api.company",
        "pk": i,
        "fields": {
            "name": f"Company {i}",
            "industry": f"Industry {i % 5}",
            "location": f"City {i % 10}"
        }
    })

with open("sample_data.json", "w") as f:
    json.dump(data, f, indent=2)