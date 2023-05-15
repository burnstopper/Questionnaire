ARG QUESTIONNAIRE_PORT

FROM nginx:1.23-alpine-slim
RUN rm /etc/nginx/conf.d/default.conf
COPY ./*.conf.template /etc/nginx/templates/
EXPOSE $QUESTIONNAIRE_PORT
CMD ["nginx", "-g", "daemon off;"]