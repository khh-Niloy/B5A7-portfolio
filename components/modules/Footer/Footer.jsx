"use client";

import { ArrowUpRight } from "lucide-react";
import React, { useState } from "react";
import { FaLinkedin } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { useRef } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

export default function Footer() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_0ovaa67", "template_xmrqy23", form.current, {
        publicKey: "2lnxgrL-gZWZCnyVy",
      })
      .then(
        () => {
          toast.success("Your message has been sent successfully");
          e.target.reset();
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  return (
    <div className="text-white relative flex items-center justify-center flex-col overflow-hidden py-24">
      <img
        src="/pattern.png"
        className="sm:w-[50%] w-[100%] absolute top-32 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40"
        alt=""
      />
      <h1 className="text-4xl font-bold text-center">
        Ready to take <span className="text-[#CBACF9]">your</span> digital{" "}
        <br /> presence to the next level?
      </h1>
      <h1 className="text-[#C1C2D3] text-sm mt-2 text-center">
        Reach out to me today and <br /> let's discuss how I can help you
        achieve your goals.
      </h1>

      <div className="mt-10 flex items-center gap-2">
        <a
          href="https://github.com/khh-Niloy"
          target="_blank"
          className="hover:-translate-y-1 duration-300 transition-all"
        >
          <div className="p-2 rounded-full border border-[#66699C6E] bg-[radial-gradient(circle,_rgba(255,255,255,1)_0%,_rgba(255,255,255,0.0)_4%,_rgba(255,255,255,0.20)_100%)]">
            <FaGithub />
          </div>
        </a>
        <a
          href="https://www.linkedin.com/in/hasibhossain-niloy01/"
          target="_blank"
          className="hover:-translate-y-1 duration-300 transition-all"
        >
          <div className="p-2 rounded-full border border-[#66699C6E] bg-[radial-gradient(circle,_rgba(255,255,255,1)_0%,_rgba(255,255,255,0.0)_4%,_rgba(255,255,255,0.20)_100%)]">
            <FaLinkedin />
          </div>
        </a>
        <a
          href="https://www.facebook.com/khhniloy.niloy/"
          target="_blank"
          className="hover:-translate-y-1 duration-300 transition-all"
        >
          <div className="p-2 rounded-full border border-[#66699C6E] bg-[radial-gradient(circle,_rgba(255,255,255,1)_0%,_rgba(255,255,255,0.0)_4%,_rgba(255,255,255,0.20)_100%)]">
            <FaFacebook />
          </div>
        </a>
      </div>

      <div className="mt-20 w-full max-w-2xl mx-auto px-6">
        <form
          ref={form}
          onSubmit={sendEmail}
          className="bg-white/3 border border-white/8 rounded-2xl p-8 backdrop-blur-sm"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Get In Touch</h3>
            <p className="text-gray-400 text-sm">Let's discuss your next project</p>
          </div>
          
          <div className="space-y-6">
            {/* Name and Email Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  name="name"
                  required
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-5 py-3.5 bg-white/3 border border-white/8 rounded-xl text-white placeholder:text-gray-400 focus:bg-white/8 focus:border-white/20 focus:outline-none transition-all duration-200"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              
              <div className="relative">
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-5 py-3.5 bg-white/3 border border-white/8 rounded-xl text-white placeholder:text-gray-400 focus:bg-white/8 focus:border-white/20 focus:outline-none transition-all duration-200"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Message */}
            <div className="relative">
              <textarea
                name="message"
                required
                placeholder="Tell me about your project, ideas, or just say hello..."
                rows="5"
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-white/30 focus:outline-none transition-all duration-300 resize-none"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="group px-8 py-3 bg-white/8 hover:bg-white/15 border border-white/15 hover:border-white/25 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] flex items-center gap-2"
              >
                Send Message
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
