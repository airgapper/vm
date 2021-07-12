configure :development do
  activate :livereload
end

set :css_dir, 'css'
set :js_dir, 'js'
set :images_dir, 'img'
set :fonts_dir,  'font'

activate :bootstrap_navbar

configure :build do
  activate :minify_css
  activate :minify_javascript
  activate :asset_hash
end

# https://github.com/middleman/middleman/issues/1300
ignore 'img/distros/LICENSE.md'
ignore 'img/addons/LICENSE.md'
