#!/bin/bash

PS3='개발 환경을 선택해주세요: '
options=("front-end" "back-end" "Quit")
select opt in "${options[@]}"
do
    case $opt in
        "front-end")
            echo -e "\n\033[32mfront-end\033[0m를 선택하셨습니다."
            git config core.hooksPath ./frontEnd/.githooks
            break
            ;;
        "back-end")
            echo -e "\n\033[32mback-end\033[0m를 선택하셨습니다."
            git config core.hooksPath ./backEnd/.githooks
            break
            ;;
        "Quit")
            break
            ;;
        *) echo "잘못된 선택입니다. 1-3 사이의 번호를 선택해주세요.";;
    esac
done

echo -e "현재 githooks 경로: \033[32m$(git config --get core.hooksPath)\033[0m"
