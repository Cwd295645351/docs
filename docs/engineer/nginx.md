# nginx 配置

## nginx 常用配置

```nginx

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
  worker_connections  1024;
}


http {
  include       mime.types;
  default_type  application/octet-stream;

  #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
  #                  '$status $body_bytes_sent "$http_referer" '
  #                  '"$http_user_agent" "$http_x_forwarded_for"';

  #access_log  logs/access.log  main;

  sendfile        on;
  #tcp_nopush     on;

  #keepalive_timeout  0;
  keepalive_timeout  65;

  #gzip  on;

  server {
    listen       80;
    server_name  localhost;

    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    location / {
      root   html;
      index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
      root   html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
  }

  server {
    listen 8080;
    server_name localhost;
    location / {
      proxy_pass http://www.day10.cn;
    }
    # html设置history模式
    location / {
      index index.html index.htm;
      proxy_set_header Host $host;
      # history模式最重要就是这里
      try_files $uri $uri/ /index.html;
      # index.html文件不可以设置强缓存 设置协商缓存即可
      add_header Cache-Control 'no-cache, must-revalidate, proxy-revalidate, max-age=0';
    }

    # 接口反向代理
    location ^~ /api/ {
      # 跨域处理 设置头部域名
      add_header Access-Control-Allow-Origin *;
      # 跨域处理 设置头部方法
      add_header Access-Control-Allow-Methods 'GET,POST,DELETE,OPTIONS,HEAD';
      # 改写路径
      rewrite ^/api/(.*)$ /$1 break;
      # 反向代理
      proxy_pass http://static_env;
      proxy_set_header Host $http_host;
    }

    #配置WebSocket服务
    location /api {
      proxy_pass http://127.0.0.1:8082/api;
      proxy_http_version 1.1;
      proxy_connect_timeout 86400s;
      proxy_read_timeout 86400s;
      proxy_send_timeout 86400s;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;
    }

  }


  # another virtual host using mix of IP-, name-, and port-based configuration
  #
  #server {
  #    listen       8000;
  #    listen       somename:8080;
  #    server_name  somename  alias  another.alias;

  #    location / {
  #        root   html;
  #        index  index.html index.htm;
  #    }
  #}


  # HTTPS server
  #
  #server {
  #    listen       443 ssl;
  #    server_name  localhost;

  #    ssl_certificate      cert.pem;
  #    ssl_certificate_key  cert.key;

  #    ssl_session_cache    shared:SSL:1m;
  #    ssl_session_timeout  5m;

  #    ssl_ciphers  HIGH:!aNULL:!MD5;
  #    ssl_prefer_server_ciphers  on;

  #    location / {
  #        root   html;
  #        index  index.html index.htm;
  #    }
  #}

}
```

## location 优先级

- 等号类型（=）的优先级最高。一旦匹配成功，则不再查找其他匹配项，停止搜索。
- ^~类型表达式，不属于正则表达式。一旦匹配成功，则不再查找其他匹配项，停止搜索。
- 正则表达式类型（~ ~\*）的优先级次之。如果有多个 location 的正则能匹配的话，则使用正则表达式最长的那个。
- 常规字符串匹配类型。按前缀匹配。
- / 通用匹配，如果没有匹配到，就匹配通用的

location 优先级从高到底：

(location =) > (location 完整路径) > (location ^~ 路径) > (location ~,~\* 正则顺序) > (location 部分起始路径) > (/)

## 反向代理

nginx 通过设置 `proxy_pass` 字段来实现反向代理

```nginx
server {
  listen       80;
  server_name  localhost;

  location / {
    proxy_pass http://localhost:8081;
    proxy_set_header Host $host:$server_port;
    # 设置用户ip地址
    proxy_set_header X-Forwarded-For $remote_addr;
    # 当请求服务器出错去寻找其他服务器
    proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
  }

}
```

## 负载均衡

负载均衡通过 `upstream`字段来实现，负载均衡策略如下：

### 1.RR(round robin: 轮询 默认)

```nginx
upstream web_servers {
  server localhost:8081;
  server localhost:8082;
}

server {
  listen       80;
  server_name  localhost;
  #access_log  logs/host.access.log  main;


  location / {
    proxy_pass http://web_servers;
    # 必须指定Header Host
    proxy_set_header Host $host:$server_port;
  }
}
```

### 2.权重

通过给不同的 `server` 设置不同的 `weight` 来实现不同的接收比例

```nginx
upstream test {
  server localhost:8081 weight=1;
  server localhost:8082 weight=3;
  server localhost:8083 weight=4 backup;
}
```

`backup` 是指热备，只有当 8081 和 8082 都宕机的情况下才走 8083

### 3.ip_hash

`iphash` 的每个请求按访问 ip 的 hash 结果分配，这样每个访客固定访问一个后端服务器，可以解决 session 的问题

```nginx
upstream test {
  ip_hash;
  server localhost:8080;
  server localhost:8081;
}
```

### 4.fair(第三方，需要安装)

按后端服务器的响应时间来分配请求，响应时间短的优先分配。这个配置是为了更快的给用户响应

```nginx
upstream backend {
  fair;
  server localhost:8080;
  server localhost:8081;
}
```

### 5.url_hash(第三方，需要安装)

按访问 url 的 hash 结果来分配请求，使每个 url 定向到同一个后端服务器，后端服务器为缓存时比较有效。在 upstream 中加入 hash 语句，server 语句中不能写入 weight 等其他的参数，hash_method 是使用的 hash 算法

```nginx
upstream backend {
  hash $request_uri;
  hash_method crc32;
  server localhost:8080;
  server localhost:8081;
}
```

## nginx 常见指令

| 指令            | 功能                                  |
| --------------- | ------------------------------------- |
| nginx -s reopen | 重启 Nginx                            |
| nginx -s reload | 重新加载配置文件，优雅重启 推荐使用   |
| nginx -s stop   | 强制停止                              |
| nginx -s quit   | 安全退出                              |
| nginx -t        | 检测配置文件地址 以及检测配置是否正常 |
| nginx -v        | 显示版本信息并退出                    |
| killall nginx   | 杀死所有 nginx 进程                   |
