FROM node:latest as node

WORKDIR /

COPY . .

RUN npm install -g pnpm
RUN npm install -g typescript
RUN pnpm install pm2 -g --global-bin-dir=/usr/local/bin

ENV PATH="${PATH}:/usr/local/bin"

RUN pnpm install express
RUN pnpm --version
RUN pnpm setup --sh=sh

RUN pnpm install
RUN pnpm run build-stage

RUN apt-get update

RUN apt-get install -y nano wget dialog net-tools
RUN apt-get install -y nginx  
RUN rm -v /etc/nginx/nginx.conf

ADD nginx.conf /etc/nginx/

RUN echo "daemon off;" >> /etc/nginx/nginx.conf

EXPOSE 82


RUN sed -i 's/\r$//' $app/start.sh  && \  
       chmod +x $app/start.sh

ENTRYPOINT $app/start.sh
