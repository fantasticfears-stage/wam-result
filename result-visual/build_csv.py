#%%
import subprocess
import glob

DBNAME = 'wam'

for filename in glob.glob('*.pgsql'):
    name, _ = filename.split('.')
    with open(filename, 'r') as f:
        content = f.read()
        result = subprocess.run(f'psql -d {DBNAME} -t -A -F"," -c "{content}" > public/data/{name}.csv', shell=True)
        print(result)

#%%
print('psql -d wam -t -A -F"," -c -- weekly updates by campaign\nSELECT\n    COUNT(1),\n    TRUNC(DATE_PART(\'day\', a.dateadded - \'2017-11-01 00:00:00\')/7) + 1 AS week_added,\n    e.code,\n    e.description\nFROM\n    fountain.article a\n    JOIN fountain.editathon e ON e.id = a.editathonid\nWHERE (LOWER(e.code)\n    LIKE \'asian-month-2017-%\')\nGROUP BY\n    week_added,\n    e.code,\n    e.description\nORDER BY\n    week_added,\n    e.code;\n > public/data/weekly.csv')
