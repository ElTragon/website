type LinkType = {
  routeTo: string
  name: string
  isDocument?: boolean
}

export const NavLinks: LinkType[] = [
  { routeTo: "/", name: "Home" },
  { routeTo: "/#work", name: "Work" },
  { routeTo: "/blogs/", name: "Writing" },
  { routeTo: "/#about", name: "About" },
  { routeTo: "/resume.pdf", name: "Resume", isDocument: true },
  { routeTo: "/#contact", name: "Contact" },
]
