import Education from "@/components/modules/About/Education";
import { Journey } from "@/components/modules/About/Journey";
import SocialLinks from "@/components/modules/About/SocialLinks";
import Banner from "@/components/modules/Hero/Banner";
import getAbout from "@/helper/getAbout";
import TechStack from "@/components/modules/Tech/TechStack";
import AllProjectList from "@/components/modules/Projects/AllProjectList";
import AllBlogList from "@/components/modules/Blog/AllBlogList";
import Footer from "@/components/modules/Footer/Footer";
import Experience from "@/components/modules/Experience/Experience";

// Force dynamic rendering
// export const dynamic = "force-dynamic";

export default async function Home() {
  const aboutContent = await getAbout();
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
      <div className="w-[85%] lg:w-[90%] mx-auto">
        <div
          id="about"
          className="w-full mx-auto gap-3 flex flex-col lg:flex-row mt-20"
        >
          <div className="xl:w-1/2 lg:w-[45%]">
            <Journey content={aboutContent.journey} />
          </div>

          <div className="xl:w-1/2 lg:w-[55%] flex flex-col gap-5">
            <SocialLinks content={socialLinksContent} />
            <Education content={educationContent} />
          </div>
        </div>

        <div id="experience" className="mt-10 ">
          <Experience />
        </div>

        <div id="skills" className="mt-20 ">
          <TechStack />
        </div>

        <div id="projects" className=" ">
          <AllProjectList />
        </div>

        <div className=" ">
          <AllBlogList />
        </div>

        <div id="contact" className="">
          <Footer />
        </div>
      </div>
    </>
  );
}
