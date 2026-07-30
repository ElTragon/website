type LinkType = {
  routeTo: string
  name: string
  isDocument?: boolean
}

export const NavLinks: LinkType[] = [
  { routeTo: "/", name: "Home" },
  { routeTo: "/blogs/", name: "Blogs" },
  { routeTo: "/resume.pdf", name: "Resume", isDocument: true },
]
