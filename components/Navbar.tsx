"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import getMe from "@/helper/getMe";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getAbout from "@/helper/getAbout";

export function NavbarDemo() {
  const navItems = [
    {
      name: "Home",
      link: "#home",
    },
    {
      name: "About",
      link: "#about",
    },
    {
      name: "Skills",
      link: "#skills",
    },
    {
      name: "Projects",
      link: "#projects",
    },
    {
      name: "Blogs",
      link: "#blog",
    },
    {
      name: "Experience",
      link: "#experience",
    },
  ];


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: string
  ) => {
    e.preventDefault();

    if (window.location.pathname.startsWith("/blogs")) {
      router.push(`/${link}`);
      setIsMobileMenuOpen(false);
      return;
    }

    const targetId = link.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsMobileMenuOpen(false);
  };

  const [me, setMe] = useState<Record<string, unknown> | null>(null);
  const [resumeLink, setResumeLink] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchMe = async () => {
      const me = await getMe();
      setMe(me);
    };
    const fetchLink = async()=>{
      const link = await getAbout()
    setResumeLink(link.contacts[3].link)
    }
    fetchMe();
    fetchLink()
  }, []);

  const handleLogout = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/logout`, {
      credentials: "include",
      method: "POST",
    });
    const result = await res.json();
    if (result.success) {
      setMe(null);
      router.push("/");
    }
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} onItemClick={handleNavClick} />
          <div className="flex items-center gap-4">
            {/* {me ? (
              <>
                <NavbarButton href="/dashboard" variant="secondary">
                  Dashboard
                </NavbarButton>
                <NavbarButton
                  onClick={() => handleLogout()}
                  variant="secondary"
                >
                  Logout
                </NavbarButton>
              </>
            ) : (
              <NavbarButton href="/login" variant="secondary">
                Login
              </NavbarButton>
            )} */}

            <NavbarButton target="_blank" href={resumeLink as string} variant="primary">
              My Resume
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={(e) => handleNavClick(e, item.link)}
                className="relative text-white"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {/* {me ? (
                <>
                  <NavbarButton href="/dashboard" variant="secondary">
                    Dashboard
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => handleLogout()}
                    variant="secondary"
                  >
                    Logout
                  </NavbarButton>
                </>
              ) : (
                <NavbarButton href="/login" variant="secondary">
                  Login
                </NavbarButton>
              )} */}
              <NavbarButton target="_blank" href={resumeLink as string} variant="primary">
                My Resume
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
