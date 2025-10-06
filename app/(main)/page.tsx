import Education from "@/components/modules/About/Education";
import { Journey } from "@/components/modules/About/Journey";
import SocialLinks from "@/components/modules/About/SocialLinks";
import Banner from "@/components/modules/Hero/Banner";
import getAbout from "@/helper/getAbout";
import TechStack from "@/components/modules/Tech/TechStack";

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
      <div className="w-full mx-auto gap-3 flex mt-20">
        <div className="w-1/2">
          <Journey content={aboutContent.journey} />
        </div>

        <div className="w-1/2 flex flex-col gap-5">
          <SocialLinks content={socialLinksContent} />
          <Education content={educationContent} />
        </div>
      </div>

      <div className="mt-20 ">
        <TechStack />
      </div>
    </div>
    </>
  );
}
