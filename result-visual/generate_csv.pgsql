-- 20 global top users (25 fetched)
SELECT
    a.User AS username,
    COUNT(a.NAME) AS article_count,
    e.code as editathon_code,
    e.Description AS editathon_description,
            MAX(a.dateadded) as last_submitted_date
FROM
    fountain.article a
    LEFT JOIN fountain.editathon e ON a.EditathonId = e.Id
WHERE (LOWER(e.Code)
    LIKE 'asian-month-2017-%')
GROUP BY
    a.User,
    e.Code,
    e.Description
ORDER BY
    article_count desc,
    last_submitted_date ASC
LIMIT 25;

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

-- TEST: 10 top users
SELECT
    a.user,
    COUNT(a.NAME) AS article_count
FROM
    fountain.article a
WHERE
    a.editathonid = 151
GROUP BY
    a.user
ORDER BY
    article_count DESC;

-- articles submitted per day
SELECT
    COUNT(1),
    a.dateadded::DATE AS date_added,
    e.code,
    e.description
FROM
    fountain.article a
    JOIN fountain.editathon e ON e.id = a.editathonid
WHERE (LOWER(e.code)
    LIKE 'asian-month-2017-%')
GROUP BY
    date_added,
    e.code,
    e.description
ORDER BY
    date_added,
    e.code;

-- weekly updates by campaign
SELECT
    COUNT(1),
    TRUNC(DATE_PART('day', a.dateadded - '2017-11-01 00:00:00')/7) + 1 AS week_added,
    e.code,
    e.description
FROM
    fountain.article a
    JOIN fountain.editathon e ON e.id = a.editathonid
WHERE (LOWER(e.code)
    LIKE 'asian-month-2017-%')
GROUP BY
    week_added,
    e.code,
    e.description
ORDER BY
    week_added,
    e.code;

-- total BY campaign
SELECT
    COUNT(1),
    e.code,
    e.description
FROM
    fountain.article a
    JOIN fountain.editathon e ON e.id = a.editathonid
WHERE (LOWER(e.code)
    LIKE 'asian-month-2017-%')
GROUP BY
    e.code,
    e.description
ORDER BY
    e.code;

-- total by article
SELECT
    COUNT(1)
FROM
    fountain.article a
    JOIN fountain.editathon e ON e.id = a.editathonid
WHERE (LOWER(e.code)
    LIKE 'asian-month-2017-%');

-- meta
select
	COUNT(distinct a.user) as user_count,
    COUNT(a.NAME) AS article_count,
    e.code as editathon_code,
    e.Description AS editathon_description
FROM
    fountain.article a
    LEFT JOIN fountain.editathon e ON a.EditathonId = e.Id
WHERE (LOWER(e.Code)
    LIKE 'asian-month-2017-%')
GROUP by
    e.Code,
    e.Description
ORDER BY
    article_count desc;
