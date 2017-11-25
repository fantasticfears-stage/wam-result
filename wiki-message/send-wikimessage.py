#!/usr/bin/env python3

#%%
import pywikibot as pb
import pandas as pd

site = pb.Site('meta', 'meta')
organizer_column = pd.read_csv('WAM_organizers.csv')['organizer (| separated)']

message = """== Wikipedia Asian Month 2017 officially starts! ==

Dear WAM organizer,

I’m Erick Guan, the coordinator of WAM 2017. Welcome to [[Wikipedia Asian Month 2017]]. Here is some information about organizations of events at a national level.

=== Timeline ===
The event lasts a month for the participants. As of the beginning of the event, please:
* '''Invite''' previous participants to join. We have a [[Wikipedia Asian Month 2017/SampleInvitation|template]] you may want to use.
* '''Setup''' your WAM page in your local wikiproject if you haven’t done that.
* '''Link''' your WAM page at [[Wikipedia Asian Month 2017]]. It’s important for others to understand and connect to your community! Remove the X when you done that. WAM is organized at national level. So I have to ask you to put your country in front of your name if you haven’t done that.
* '''Publish''' a notification about WAM in site notice as well as village pump. Go public!
* '''Connect''' with us. Generally send me an email so that we can reach you for future information!
* '''Become''' the jury member in a campaign on Fountain which is an amazing tool for you to supervise participants’ articles. If you don’t have the campaign set up, please contact us! And put a link to your community’s campaign page for participants’ navigation.
* '''Organize''' a off-site editathon event. A coffee bar, internet and laptops. Though it’s optional. If you want to do that, please contact me.

In the following days, you should answer the questions from your community and supervise the submissions. Hope you have fun!

=== Interesting articles ===

Have some interesting articles in your mind or from community? Drop us a line so that we can exchange the information to other communities.

=== Looking for help ===

At all times, please send me an email at erick@asianmonth.wiki--~~~~
"""

for row in organizer_column:
    users = row.split('|')
    for u in users:
        print("************\n")
        page = pb.Page(site, f"User Talk:{u}")
        print(page)
        try:
          print(page.get()[:100])
          page.text += "\n\n" + message
        except pb.NoPage as e:
            page.text = message
        page.save(minor=False, summary='WAM starts')



