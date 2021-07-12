require 'digest'
require 'nokogiri'

module VariousHelper
  INDIEGOGO_URL = 'https://www.indiegogo.com/projects/virtkick-take-cloud-back'

  def gravatar_for email, options = {}
    options = {:alt => 'avatar', :class => 'avatar', :size => 80}.merge! options
    id = email.include?('@') ? Digest::MD5::hexdigest(email.strip.downcase) : email
    url = 'https://www.gravatar.com/avatar/' + id + '.jpg?s=' + options[:size].to_s + "&d=mm"
    options.delete :size
    image_tag url, options
  end

  def igg_details project_url = INDIEGOGO_URL
    metadata = {}
    metadata[:url] = project_url

    if build? or ENV['LIVE']
      doc = Nokogiri::HTML open project_url
      metadata[:backers] = element(doc, '[data-tab-id="pledges"] .i-count').to_i
      metadata[:goal_formatted] = element(doc, '.i-raised .currency span')
      metadata[:goal] = currency_to_number metadata[:goal_formatted]
      metadata[:pledged] = currency_to_number(element(doc, '.i-balance .currency span')) + 18000 # seed accelerator
      metadata[:pledged_percent] = (metadata[:pledged].to_f / metadata[:goal].to_f * 100).ceil
    else
      metadata[:backers] = 12
      metadata[:goal] = 16000
      metadata[:pledged] = 1337
      metadata[:pledged_percent] = 23
    end
    metadata[:pledged_formatted] = number_to_currency metadata[:pledged], precision: 0
    metadata[:pledged_percent_capped] = kickstarter_bar_width metadata[:pledged_percent]
    metadata
  end

  private
  def element doc, selector
    node = doc.css(selector)
    node.text
  end

  def currency_to_number currency
    currency.gsub(/\D/,'').to_i
  end

  def kickstarter_bar_width pledged_percent
    if pledged_percent < 2
      2
    elsif pledged_percent > 100
      100
    else
      pledged_percent
    end
  end
end
