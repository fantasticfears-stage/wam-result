#%%
import pywikibot as pwb
import requests
from bs4 import BeautifulSoup

r = requests.get('https://meta.wikimedia.org/w/index.php?title=Special%3APrefixIndex&prefix=Centralnotice-WAM+2017-&namespace=8')
soup = BeautifulSoup(r.text, "html5lib")
template = [a['title'] for a in soup.find('ul', { "class": 'mw-prefixindex-list'}).find_all('a')]
result = [list(reversed(a.split(r'/'))) for a in template]
result = [a for a in result if len(a) > 1]
by_lang = {}
for a in result:
    by_lang.setdefault(a[0], [])
    by_lang[a[0]].append(f"{a[1]}/{a[0]}")


site = pwb.Site('meta', 'meta')

for lang, titles in by_lang.items():
    print("=====================")
    print("lang:")
    print(lang)
    for t in titles:
        p = pwb.Page(site, t)
        print(f"page: {t}")
        print(p.get())
