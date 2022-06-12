container_image=$1
container_network=mynetwork

service_name=web

is_service_up() {
  if [[ -z $(docker ps -f name=$service_name -q | head -n1) ]]; then
    echo "0"
  else
    echo "1"
  fi
}

up_container() {
    docker service rm $service_name
    
    docker service create --update-order start-first --update-failure-action rollback --rollback-order stop-first --restart-condition on-failure --restart-max-attempts 3 --replicas $replica --network $container_network --name $service_name $container_image
}

update_server() {
  docker service update --force --update-order start-first --update-failure-action rollback --rollback-order stop-first --restart-condition on-failure --restart-max-attempts 3 --replicas 1 $service_name

  # deployment error
  if [[ $(docker service inspect $service_name --format "{{.UpdateStatus.State}}") = "rollback_completed" ]]; then
    echo "Deployment rollback..."
    exit 1
  fi
}

deploy() {
  local replica=1

  docker network create -d overlay $container_network --attachable

  up_container $replica
}

determine_deployment_strategy() {  
  if [[ $(is_service_up) = "0" ]]; then
    echo "No server is up... use deploy strategy!"

    deploy

  else
    echo "One server is up... use update strategy!"

    update_server
  fi

  echo "DONE !"
}

# call func
determine_deployment_strategy
