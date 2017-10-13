#!/usr/bin/env ruby

# Copyright 2017. Erick Guan (fantasticfears@gmail.com)
#
# This script sends emails via Mailgun.
# Be sure to check constant settings.
# Default settings:
# - CONTENT_FILENAME: content.txt
# - RECIPIENTS_CSV_FILENAME: recipients.csv
# - SENDING_DOMAIN: mg.asianmonth.wiki
#
# Requirements: ruby 2.1+
#
# Invoke by:
# ruby sender.rb <dir_path> <sender_email>

CONTENT_FILENAME = 'content.txt'.freeze
RECIPIENTS_CSV_FILENAME = 'recipients.csv'.freeze
SENDING_DOMAIN = 'mg.asianmonth.wiki'.freeze

puts 'Starting to collect information...'

dir_name = ARGV[0]
unless Dir.exist?(dir_name)
  puts "Can't find #{dir_name}"
  exit 0
end

content_filename = File.join(dir_name, CONTENT_FILENAME)
recipients_filename = File.join(dir_name, RECIPIENTS_CSV_FILENAME)

unless [content_filename, recipients_filename].all? { |f| File.exist?(f) }
  puts "Can't find files. They should be named as #{CONTENT_FILENAME} and #{RECIPIENTS_CSV_FILENAME}."
  exit 0
end

email_content = File.open(content_filename).read
num_recipients = File.open(recipients_filename).readlines.count
sender_email = ARGV[1]

puts 'You are about to send this email:'
puts '[body]' + '-' * 44
puts File.open(content_filename).read
puts '-' * 50
puts "From: #{sender_email}"
puts "To #{num_recipients} people, confirm? [y/N]"
prompt = STDIN.gets.chomp
return unless prompt == 'y'

require 'mailgun'
require 'csv'
mg_client = Mailgun::Client.new ENV['MAILGUN_KEY']

CSV.foreach(recipients_filename) do |row|
  recipient = row[1]

  message_params = { from: sender_email,
                     to:  recipient,
                     subject: 'The Ruby SDK is awesome!',
                     text:    email_content }

  mg_client.send_message SENDING_DOMAIN, message_params
end
