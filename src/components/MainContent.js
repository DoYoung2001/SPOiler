import React from "react";
import ContentCard from "./ContentCard";

const MainContent = () => (
  <main className="main-content">
    <h1>최근 업데이트된 콘텐츠</h1>
    <div className="content-cards">
      <ContentCard />
      <ContentCard />
      <ContentCard />
    </div>
  </main>
);

export default MainContent;
