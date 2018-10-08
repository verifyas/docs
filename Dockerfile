# This is production build file
FROM ruby:2.5.1-alpine3.7

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# RUN apk add --no-cache --update build-base make git tzdata

RUN apk add --no-cache --update build-base make git postgresql-dev tzdata \
  && gem install \
  nokogiri:1.8.4 \
  nio4r:2.3.1 \
  ffi:1.9.25 \
  fast_blank:1.0.0 \
  redcarpet:3.4.0 \
  && apk del build-base \
  && rm -rf /var/cache/apk/*

ADD Gemfile /usr/src/app/
ADD Gemfile.lock /usr/src/app/

RUN bundle install

RUN apk add --no-cache --update nodejs


ADD . /usr/src/app

CMD ["middleman", "server"]

