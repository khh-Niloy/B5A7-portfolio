import Education from "@/components/modules/About/Education";
import { Journey } from "@/components/modules/About/Journey";
import SocialLinks from "@/components/modules/About/SocialLinks";
import Banner from "@/components/modules/Hero/Banner";
import getAbout from "@/helper/getAbout";
import TechStack from "@/components/modules/Tech/TechStack";
import AllProjectList from "@/components/modules/Projects/AllProjectList";
import AllBlogList from "@/components/modules/Blog/AllBlogList";
import Footer from "@/components/modules/Footer/Footer";

export default async function Home() {
  const aboutContent = await getAbout();
  console.log(aboutContent);
  const educationContent = {
    education: aboutContent.universityInfo,
    sampleText: aboutContent.aboutInfo.sampleText,
  };
  const socialLinksContent = {
    socialLinks: aboutContent.contacts,
    email: aboutContent.aboutInfo.email,
  };

  return (
    <>
      <Banner />
      <div className="w-[85%] mx-auto">
        <div id="about" className="w-full mx-auto gap-3 flex mt-20">
          <div className="w-1/2">
            <Journey content={aboutContent.journey} />
          </div>

          <div className="w-1/2 flex flex-col gap-5">
            <SocialLinks content={socialLinksContent} />
            <Education content={educationContent} />
          </div>
        </div>

        <div id="skills" className="mt-20 ">
          <TechStack />
        </div>

        <div id="projects" className="mt-20 ">
          <AllProjectList />
        </div>

        <div className="mt-20 ">
          <AllBlogList />
        </div>

        <div id="contact" className="mt-20 ">
          <Footer />
        </div>
      </div>
    </>
  );
}
