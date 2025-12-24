FROM golang:1.25.5-alpine AS builder

WORKDIR /app

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o zone_2_coaching ./server

RUN tar -czf source.tar.gz home

FROM alpine:latest

RUN apk --no-cache add ca-certificates

COPY --from=builder /app/source.tar.gz ./
RUN tar -xzf ./source.tar.gz && rm ./source.tar.gz
COPY --from=builder /app/zone_2_coaching ./

CMD ["./zone_2_coaching"]

EXPOSE 8080
