{
  "name": "Расписание",
  "short_name": "Расписание",
  "theme_color": "#FFFFFF",
  "background_color": "#FFFFFF",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "/",
  "start_url": "/<? echo explode('/', parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH))[1] ?>"
}