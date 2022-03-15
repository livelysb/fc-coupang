# FC Coupang Match History
FC쿠팡 축구경기 기록 관리 ( 모바일 웹 환경 )

베타버전링크 : http://ec2-3-38-185-67.ap-northeast-2.compute.amazonaws.com

## Tech Stack

Frontend: React

Backend: SpringBoot 2.6.3, Kotlin, JPA

Database: MySQL, Redis



## Feature 
### DONE
  1. 선수 등록
    - FC 쿠팡 가입회원 등록
  2. 오늘의 선수명단
    - 경기 시작에 필요한 선수를 쉽게 조회하기 위해 경기일 참석자 저장
  3. 경기 기록
    - 매 경기에 참여하는 선수와 팀 선택하여 경기내용 기록
    - 득점선수, 도움선수 기록
### TO-BE
  1. 경기 결과
    - 기록된 경기 내용을 조회
  2. 선수 이력
    - 각 선수별 경기 이력을 조회 ( 경기참여 수, 승, 무, 패, 승률, 득점 수, 도움 수 )
  3. 회원 관리
    - 회원 가입 및 로그인 기능
  4. 선수 케미
    - 같은 경기로 참여했을 때의 승률이 높거나, 득점과 도움의 연관관계가 높은 선수 관리
  5. 팀 추천
    - 균형있는 팀을 구성하여 경기를 하기 위한 오늘의 선수 기반 팀 추천
