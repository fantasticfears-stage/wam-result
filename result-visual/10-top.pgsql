-- 10 top users in each campaign (15 fetched for each campaign)
WITH list AS (
    SELECT
        a.User,
        COUNT(1) AS article_count,
                e.code,
        e.description,
        MAX(a.dateadded) as last_submitted_date
    FROM
        fountain.article a
        JOIN fountain.editathon e ON e.id = a.editathonid
    WHERE (LOWER(e.code)
        LIKE 'asian-month-2017-%')
GROUP BY
    a.User,
    e.code,
    e.description
ORDER by
    e.code,
    article_count desc,
    last_submitted_date ASC),
sorted_query AS (
    SELECT
        ROW_NUMBER()
        OVER (PARTITION BY
                list.code) AS rank_number,
            list.*
        FROM
            list
        ORDER BY
            list.code,
            list.article_count DESC
)
    SELECT
        *
    FROM
        sorted_query
    WHERE
        rank_number <= 15;
