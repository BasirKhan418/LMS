
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function Component() {
  const [activeTab, setActiveTab] = useState("instructors")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const instructors = [
    { name: "John Doe", email: "john@example.com", subjects: ["Math", "Science"] },
    { name: "Jane Smith", email: "jane@example.com", subjects: ["English", "History"] },
    { name: "Bob Johnson", email: "bob@example.com", subjects: ["Art", "Music"] },
    { name: "Sarah Lee", email: "sarah@example.com", subjects: ["Math", "Science", "English"] },
    { name: "Tom Wilson", email: "tom@example.com", subjects: ["History", "Geography"] },
    { name: "Emily Davis", email: "emily@example.com", subjects: ["Art", "Music", "Drama"] },
    { name: "Michael Brown", email: "michael@example.com", subjects: ["Math", "Science", "Computer Science"] },
    { name: "Jessica Thompson", email: "jessica@example.com", subjects: ["English", "Literature"] },
    { name: "David Anderson", email: "david@example.com", subjects: ["History", "Geography", "Economics"] },
    { name: "Olivia Martinez", email: "olivia@example.com", subjects: ["Art", "Music", "Drama", "Dance"] },
  ]
  const subjects = [
    { name: "Math", instructors: ["John Doe", "Sarah Lee", "Michael Brown"] },
    { name: "Science", instructors: ["John Doe", "Sarah Lee", "Michael Brown"] },
    { name: "English", instructors: ["Jane Smith", "Sarah Lee", "Jessica Thompson"] },
    { name: "History", instructors: ["Bob Johnson", "Tom Wilson", "David Anderson"] },
    { name: "Art", instructors: ["Bob Johnson", "Emily Davis", "Olivia Martinez"] },
    { name: "Music", instructors: ["Bob Johnson", "Emily Davis", "Olivia Martinez"] },
    { name: "Drama", instructors: ["Emily Davis", "Olivia Martinez"] },
    { name: "Geography", instructors: ["Tom Wilson", "David Anderson"] },
    { name: "Computer Science", instructors: ["Michael Brown"] },
    { name: "Literature", instructors: ["Jessica Thompson"] },
    { name: "Economics", instructors: ["David Anderson"] },
    { name: "Dance", instructors: ["Olivia Martinez"] },
  ]
  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const filteredSubjects = subjects.filter((subject) => subject.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const sortedInstructors = sortColumn
    ? filteredInstructors.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
        if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    : filteredInstructors
  const sortedSubjects = sortColumn
    ? filteredSubjects.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
        if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    : filteredSubjects
  const handleInstructorClick = (instructor) => {
    setSelectedInstructor(instructor)
    setShowModal(true)
  }
  const handleEditInstructor = (instructor) => {
    setSelectedInstructor(instructor)
    setShowEditModal(true)
  }
  const handleModalClose = () => {
    setShowModal(false)
    setSelectedInstructor(null)
  }
  const handleEditModalClose = () => {
    setShowEditModal(false)
    setSelectedInstructor(null)
  }
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 bg-muted/40 p-6">
        <div className="bg-background rounded-lg shadow-md">
          <div className="border-b flex">
            <button
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === "instructors" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
              onClick={() => setActiveTab("instructors")}
            >
              Instructors
            </button>
            <button
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === "subjects" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
              onClick={() => setActiveTab("subjects")}
            >
              Subjects
            </button>
          </div>
          {activeTab === "instructors" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Input
                  type="search"
                  placeholder="Search instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => {
                        if (sortColumn === "name") {
                          setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                        } else {
                          setSortColumn("name")
                          setSortDirection("asc")
                        }
                      }}
                    >
                      Instructor Name{" "}
                      {sortColumn === "name" && (
                        <span className="ml-2">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                      )}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => {
                        if (sortColumn === "email") {
                          setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                        } else {
                          setSortColumn("email")
                          setSortDirection("asc")
                        }
                      }}
                    >
                      Email{" "}
                      {sortColumn === "email" && (
                        <span className="ml-2">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                      )}
                    </TableHead>
                    <TableHead>Subjects Assigned</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedInstructors.map((instructor) => (
                    <TableRow key={instructor.email}>
                      <TableCell>
                        <button
                          className="text-primary hover:underline"
                          onClick={() => handleInstructorClick(instructor)}
                        >
                          {instructor.name}
                        </button>
                      </TableCell>
                      <TableCell>{instructor.email}</TableCell>
                      <TableCell>{instructor.subjects.join(", ")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="ghost" onClick={() => handleEditInstructor(instructor)}>
                            <FilePenIcon className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {activeTab === "subjects" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Input
                  type="search"
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Subject
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => {
                        if (sortColumn === "name") {
                          setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                        } else {
                          setSortColumn("name")
                          setSortDirection("asc")
                        }
                      }}
                    >
                      Subject Name{" "}
                      {sortColumn === "name" && (
                        <span className="ml-2">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                      )}
                    </TableHead>
                    <TableHead>Instructors Assigned</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSubjects.map((subject) => (
                    <TableRow key={subject.name}>
                      <TableCell>{subject.name}</TableCell>
                      <TableCell>{subject.instructors.join(", ")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="ghost">
                            <FilePenIcon className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
      {showModal && selectedInstructor && (
        <Dialog open={showModal} onOpenChange={handleModalClose}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Courses for {selectedInstructor.name}</DialogTitle>
              <DialogDescription>Assign courses to {selectedInstructor.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {subjects.map((subject) => (
                <div key={subject.name} className="flex items-center gap-2">
                 
                  <Label htmlFor={`subject-${subject.name}`}>{subject.name}</Label>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
              <div>
                <Button variant="outline">Cancel</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {showEditModal && selectedInstructor && (
        <Dialog open={showEditModal} onOpenChange={handleEditModalClose}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Instructor: {selectedInstructor.name}</DialogTitle>
              <DialogDescription>Update the details for {selectedInstructor.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value={selectedInstructor.name} className="col-span-3" />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" value={selectedInstructor.email} className="col-span-3" />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="subjects" className="text-right">
                  Subjects
                </Label>
                <div className="col-span-3 grid gap-2">
                  {selectedInstructor.subjects.map((subject) => (
                    <div key={subject} className="flex items-center gap-2">
                      
                      <Label htmlFor={`subject-${subject}`}>{subject}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
              <div>
                <Button variant="outline">Cancel</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function FilePenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  )
}


function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}


function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}