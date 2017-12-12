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
