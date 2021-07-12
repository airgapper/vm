# VirtKick website

[![GPA](https://img.shields.io/codeclimate/github/virtkick/virtkick-website.svg?style=flat-square)](https://codeclimate.com/github/virtkick/virtkick-website)
[![Build status](https://img.shields.io/travis/virtkick/virtkick-website.svg?style=flat-square)](https://travis-ci.org/virtkick/virtkick-website)
[![Dependencies status](http://img.shields.io/gemnasium/virtkick/virtkick-website.svg?style=flat-square)](https://gemnasium.com/virtkick/virtkick-website)
[![Gratipay](https://img.shields.io/gratipay/virtkick.svg?style=flat-square)](https://gratipay.com/virtkick/)

This is a website of VirtKick, a 1-click cloud management center.
It's built with [Middleman](http://middlemanapp.com/).
Visit [https://www.virtkick.io/](https://www.virtkick.io/) to preview.

## Requirements

- [RVM](https://rvm.io/)
- Ruby 2.1 from RVM
- Linux or Mac

### One time setup

```
rvm install 2.1
rvm use 2.1 --default
gem install bundler
yaourt -S optipng pngcrush advancecomp # or apt-get install, or whatever
```

### Development

```
bundle install
bundle exec middleman server # in a new tab
xdg-open http://0.0.0.0:4567/
```

### Deployment

```
bundle exec middleman build
```

## Contributing

See [CONTRIBUTING.md](https://github.com/virtkick/virtkick-website/blob/master/CONTRIBUTING.md). Thanks!

# License

VirtKick, a simple orchestrator.
Copyright (C) 2014 StratusHost Damian Nowak

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see https://www.gnu.org/licenses/agpl-3.0.html.


# Trademark

The VirtKick name and logo are trademarks of Damian Nowak.
You may not use them for promotional purposes,
or in any way that claims, suggests or looks like
there's a relationship or endorsement by VirtKick.

Other marks and names mentioned herein may be trademarks of their respective companies.
