names=[]

with open('./TE24_5_Formatted.txt', 'r') as f:
    lines = [line.strip() for line in f.readlines()]
    for line in lines:
        tokens = line.split(',')
        if len(tokens) < 3:
            continue
        names.append(tokens[1].strip().lower())

with open('./TE_names.txt', 'w') as f:
    f.write('\n'.join(names))