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
