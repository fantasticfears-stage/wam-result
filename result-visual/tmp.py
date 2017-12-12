#%%
import csv

def remove_bom(line):
    return line[3:] if line.startswith(codecs.BOM_UTF8) else line


header = []
content = []
with open('public/data/meta.csv') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    rows = [row for row in reader]
    header = rows[0]
    header[0] = 'user_count'
    print(header)
    content = rows[1:]
    header.append('url')
    for i in content:
        lang_code = "-".join(i[2].split('-')[3:])
        i.append(f'https://{lang_code}.wikipedia.org')

with open('public/data/meta.tmp.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(header)
    writer.writerows(content)
