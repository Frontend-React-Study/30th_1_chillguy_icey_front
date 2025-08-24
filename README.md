# 🧊 ICEY - 프론트엔드 레포지토리

> 어색함을 녹이고, 말이 트이도록  
> 자연스러운 아이스브레이킹과 팀 커뮤니케이션의 모든 것, **ICEY**

---

## 팀원 소개

<table>
  <thead>
    <tr>
      <th>사진</th>
      <th>이름</th>
      <th>파트</th>
      <th>담당 기능</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img src="https://github.com/khwak/for-image/blob/main/hwakyung.png"
             width="100" height="100" style="object-fit: cover; border-radius: 50%;">
      </td>
      <td align="center"><b>강화경</b></td>
      <td align="center">팀장 / 프론트</td>
      <td>
        • 밸런스게임 (Gemini)<br/>
        • 유저별 명함 관리<br/>
        • 팀 내 메모 및 메모 반응하기 구현<br/>
        • 쪽지 기능<br/>
        • 배포
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src= "https://github.com/khwak/for-image/blob/main/haeun.png"
             width="100" height="100" style="object-fit: cover; border-radius: 50%;">
      </td>
      <td align="center"><b>송하은</b></td>
      <td align="center">프론트</td>
      <td>
        • 카카오·구글 소셜 로그인<br/>
        • 팀 관리(생성/만료/초대 및 가입)<br/>
        • 팀 내 약속잡기 (when2meet)<br/>
        • 배포
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://github.com/khwak/for-image/blob/main/sohyeon.png"
             width="100" height="100" style="object-fit: cover; border-radius: 50%;">
      </td>
      <td align="center"><b>주소현</b></td>
      <td align="center">디자인 / 프론트</td>
      <td>
        • 스몰토크 (Gemini)<br/>
        • SSE 기반 실시간 알림 구현<br/>
        • UI/UX 디자인
      </td>
    </tr>

  </tbody>
</table>

---

## ⚙️ 기술 스택

### 🧑‍💻 언어 & 프레임워크

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

### 🎨 스타일링

![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)

### 🚀 배포 환경

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

## ✨ 주요 기능

| 기능 구분            |
| -------------------- |
| 소셜 로그인          |
| SmallTalk            |
| 팀 생성 및 초대      |
| 밸런스 게임          |
| 명함                 |
| 메모                 |
| 약속 잡기            |
| 쪽지                 |
| SSE 기반 실시간 알림 |

---

## 🌐 서비스 아키텍처

<img width="4983" height="2160" alt="서비스아키텍처" src="https://github.com/khwak/for-image/blob/main/icey_arch.png" />

## 📁 프로젝트 디렉터리 구조

```
📦 30th_1_chillguy_icey_front
├─ .gitignore
├─ .prettierrc
├─ README.md
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ src
│  ├─ App.css
│  ├─ App.jsx
│  ├─ App2.jsx
│  ├─ assets
│  ├─ components
│  │  ├─ Alert
│  │  │  ├─ Alert.jsx
│  │  │  ├─ Alert.module.css
│  │  │  ├─ Login_Info.jsx
│  │  │  ├─ Login_Info.module.css
│  │  │  ├─ Notification.jsx
│  │  │  ├─ Notification.module.css
│  │  │  ├─ Notification_box.jsx
│  │  │  ├─ Notification_box.module.css
│  │  │  ├─ ViewAll.jsx
│  │  │  └─ ViewAll.module.css
│  │  ├─ Button.jsx
│  │  ├─ Button.module.css
│  │  ├─ Delete.jsx
│  │  ├─ Delete.module.css
│  │  ├─ Dialog
│  │  │  ├─ AlertDialog.jsx
│  │  │  ├─ AlertDialog.module.css
│  │  │  ├─ InfoDialog.jsx
│  │  │  ├─ InfoDialog.module.css
│  │  │  ├─ PromiseDialog.jsx
│  │  │  └─ PromiseDialog.module.css
│  │  ├─ Dropdown.jsx
│  │  ├─ Dropdown.module.css
│  │  ├─ EditSmall
│  │  │  ├─ CustomInput.jsx
│  │  │  ├─ CustomInput.module.css
│  │  │  ├─ CustomInput_write.jsx
│  │  │  ├─ CustomInput_write.module.css
│  │  │  ├─ Custominput_Container.jsx
│  │  │  ├─ Question.jsx
│  │  │  ├─ Question.module.css
│  │  │  ├─ Question_pop_up.jsx
│  │  │  └─ Question_pop_up.module.css
│  │  ├─ Header.jsx
│  │  ├─ Header.module.css
│  │  ├─ Home
│  │  │  ├─ AlertLoginDialog.jsx
│  │  │  └─ AlertLoginDialog.module.css
│  │  ├─ Letter
│  │  │  ├─ Card.jsx
│  │  │  ├─ Card.module.css
│  │  │  ├─ CardList.jsx
│  │  │  ├─ CardList.module.css
│  │  │  ├─ ReceivedLetter.jsx
│  │  │  └─ ReceivedLetter.module.css
│  │  ├─ Loading.jsx
│  │  ├─ Loading.module.css
│  │  ├─ Memo
│  │  │  ├─ Balance.jsx
│  │  │  ├─ Balance.module.css
│  │  │  ├─ Memo.jsx
│  │  │  ├─ Memo.module.css
│  │  │  ├─ MemoEdit.jsx
│  │  │  ├─ MemoEdit.module.css
│  │  │  ├─ MemoLike.jsx
│  │  │  └─ MemoLike.module.css
│  │  ├─ Modal
│  │  │  ├─ CardModal.jsx
│  │  │  ├─ CardModal.module.css
│  │  │  ├─ LetterModal.jsx
│  │  │  └─ LetterModal.module.css
│  │  ├─ NewSmallTalk
│  │  │  ├─ ConfirmSnackbar.jsx
│  │  │  └─ ConfirmSnackbar.module.css
│  │  ├─ PageLayout
│  │  │  ├─ Layout.jsx
│  │  │  ├─ Layout.module.css
│  │  │  └─ Layout_login.jsx
│  │  ├─ SemiCurve.jsx
│  │  ├─ SmallTalk
│  │  │  ├─ MakeSmallTalk.jsx
│  │  │  ├─ MakeSmallTalk.module.css
│  │  │  ├─ SmallTalkName.jsx
│  │  │  ├─ SmallTalkName.module.css
│  │  │  ├─ SmallTalk_minilist.jsx
│  │  │  └─ SmallTalk_minilist.module.css
│  │  ├─ Snackbar
│  │  │  ├─ LinkSnackbar.jsx
│  │  │  ├─ LinkSnackbar.module.css
│  │  │  ├─ Snackbar.jsx
│  │  │  └─ Snackbar.module.css
│  │  └─ Team
│  │     ├─ Board.jsx
│  │     ├─ Board.module.css
│  │     ├─ CardM.jsx
│  │     ├─ CardM.module.css
│  │     ├─ Massage.jsx
│  │     ├─ Massage.module.css
│  │     ├─ Promise.jsx
│  │     ├─ Promise.module.css
│  │     ├─ PromiseCheck.jsx
│  │     ├─ PromiseCheck.module.css
│  │     ├─ PromiseCheck2.jsx
│  │     ├─ Teambutton.jsx
│  │     ├─ Teambutton.module.css
│  │     ├─ Teamcreate.jsx
│  │     ├─ Teamcreate.module.css
│  │     ├─ Teamlist.jsx
│  │     ├─ Teamlist.module.css
│  │     └─ promise
│  │        ├─ EXPromiseCalendar.jsx
│  │        ├─ EXPromiseCalendar.module.css
│  │        ├─ PromiseCalendar.css
│  │        ├─ PromiseCalendar.jsx
│  │        ├─ PromiseCalendar.module.css
│  │        ├─ PromiseDate.jsx
│  │        ├─ PromiseDate.module.css
│  │        ├─ PromiseTime.jsx
│  │        ├─ PromiseTime.module.css
│  │        ├─ PromiseTime2.jsx
│  │        └─ PromiseTime2_Origin.jsx
│  ├─ context
│  │  └─ AuthContext.jsx
│  ├─ index.css
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ Callback.jsx
│  │  ├─ EditSmall.jsx
│  │  ├─ EditSmall.module.css
│  │  ├─ Home copy.jsx
│  │  ├─ Home.jsx
│  │  ├─ Home.module.css
│  │  ├─ Home2.module.css
│  │  ├─ IceyLogin.jsx
│  │  ├─ IcyLogin.css
│  │  ├─ IcyLogin_orgin.jsx
│  │  ├─ Invite.jsx
│  │  ├─ Invite.module.css
│  │  ├─ Letter.jsx
│  │  ├─ Letter.module.css
│  │  ├─ MyCard.jsx
│  │  ├─ MyCard.module.css
│  │  ├─ NewSmallTalk.jsx
│  │  ├─ NewSmallTalk.module.css
│  │  ├─ NotFound.jsx
│  │  ├─ NotFound.module.css
│  │  ├─ SmallTalk.jsx
│  │  ├─ SmallTalk.module.css
│  │  ├─ Team.jsx
│  │  ├─ Team.module.css
│  │  ├─ Team_Orgin.jsx
│  │  ├─ icyLogin.jsx
│  │  └─ icyLogin_Origin.css
│  └─ util
│     ├─ BoardDataAPI.js
│     ├─ CardDataAPI.js
│     ├─ LetterDataAPI.js
│     ├─ NotificationAPI.js
│     ├─ SmallTalkAPI.js
│     ├─ TeamDataAPI.js
│     ├─ TeamVoteAPI.js
│     ├─ TeamsTest.jsx
│     ├─ api.js
│     ├─ get-animal-image.js
│     └─ teams.js
└─ vite.config.js
```

©generated by [Project Tree Generator](https://woochanleee.github.io/project-tree-generator)
