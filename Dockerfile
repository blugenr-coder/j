# WorksheetHub — the whole product in one image.
#
# No build step and no dependencies to install, so this is close to the
# smallest a Node image gets: copy the source in and run it.

FROM node:22-alpine

# The database lives on a volume, not in the image. Without this the data
# disappears on every redeploy, which is the sort of thing nobody notices
# until the first one.
ENV NODE_ENV=production \
    PORT=8080 \
    HOST=0.0.0.0 \
    DATABASE=/data/worksheethub.db

WORKDIR /app
COPY . .

# Own the data directory as the unprivileged user the base image ships with,
# so the process never runs as root.
RUN mkdir -p /data && chown -R node:node /data /app
USER node
VOLUME ["/data"]

EXPOSE 8080

# The platform's own health check has a URL to poll; this one covers the case
# where there is no platform.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server/index.mjs"]
