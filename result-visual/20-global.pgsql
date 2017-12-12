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
