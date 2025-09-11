<template>
  <ShinyText text="Just some shiny text!" :disabled="false" :speed="3" class-name="your-custom-class" />

  <FuzzyText
    text="404"
    :font-size="140"
    font-weight="900"
    color="#fff"
    :enable-hover="true"
    :base-intensity="0.18"
    :hover-intensity="0.5"
  />

  <div :style="{ height: '200px', position: 'relative', overflow: 'hidden', width: '100%' }">
    <LogoLoop
      :logos="techLogos"
      :speed="50"
      direction="left"
      :logoHeight="48"
      :gap="150"
      :pauseOnHover="true"
      :scaleOnHover="true"
      :fadeOut="true"
      fadeOutColor="#ffffff"
      ariaLabel="Technology partners"
    />
  </div>

  <ProfileCard
    name="Javi A. Torres"
    title="Software Engineer"
    handle="javicodes"
    status="Online"
    contact-text="Contact Me"
    avatar-url="/assets/person.png"
    icon-url="/assets/iconpattern.png"
    grain-url="/assets/grain.webp"
    :show-user-info="true"
    :show-behind-gradient="false"
    :enable-tilt="true"
    @contact-click="handleContactClick"
  />
</template>

<script setup lang="ts">
import ShinyText from "./ShinyText.vue";
import FuzzyText from "./FuzzyText.vue";
import GlitchText from "./GlitchText.vue";
import LogoLoop from "./LogoLoop.vue";
import ProfileCard from "./ProfileCard.vue";

const techLogos = [
  {
    node: '<i class="pi pi-code" style="font-size: 2rem;"></i>',
    title: "Development",
    href: "https://vuejs.org"
  },
  {
    node: '<i class="pi pi-desktop" style="font-size: 2rem;"></i>',
    title: "Frontend",
    href: "https://vitejs.dev"
  },
  {
    node: '<i class="pi pi-server" style="font-size: 2rem;"></i>',
    title: "Backend",
    href: "https://nodejs.org"
  },
  {
    node: '<i class="pi pi-database" style="font-size: 2rem;"></i>',
    title: "Database",
    href: "https://www.postgresql.org"
  }
];

// Alternative with image sources
const imageLogos = [
  { src: "/logos/company1.png", alt: "Company 1", href: "https://company1.com" },
  { src: "/logos/company2.png", alt: "Company 2", href: "https://company2.com" },
  { src: "/logos/company3.png", alt: "Company 3", href: "https://company3.com" }
];

const handleContactClick = () => {
  console.log("Contact button clicked!");
};
</script>

<style scoped></style>
