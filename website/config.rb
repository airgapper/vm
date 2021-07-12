require 'slim/smart'

configure :development do
  activate :livereload
  activate :disqus do |d|
    d.shortname = 'virtkickdev'
  end
end

set :css_dir, 'css'
set :js_dir, 'js'
set :images_dir, 'img'
set :fonts_dir,  'font'

activate :bootstrap_navbar


activate :blog do |blog|
  blog.prefix = 'blog/'
  blog.permalink = '{title}.html'
  blog.sources = '{year}/{year}-{month}-{day}-{title}.html'

  blog.layout = 'blog_post'
  blog.summary_separator = /<!--more-->/
  blog.summary_length = 250
  blog.default_extension = '.md'

  blog.paginate = false
end
page '/blog/feed.xml', layout: false

activate :syntax
set :markdown_engine, :redcarpet
set :markdown, fenced_code_blocks: true, smartypants: true

configure :build do
  unless ENV['SKIP_IMAGEOPTIM']
    activate :imageoptim do |opts|
      opts.pngout_options = false # not available in Ubuntu
    end
  end
  activate :minify_css
  activate :minify_javascript
  activate :asset_hash
  activate :disqus do |d|
    d.shortname = 'virtkick'
  end
end

# https://github.com/middleman/middleman/issues/1300
ignore 'img/distros/LICENSE.md'