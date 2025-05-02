"use client"

import { useState } from "react"
import { X, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Toaster,toast } from "sonner"

export function PollView({ isAdmin, onClose }) {
  const [isCreating, setIsCreating] = useState(isAdmin)
  const [selectedOption, setSelectedOption] = useState("")
  const [newPoll, setNewPoll] = useState({
    question: "",
    options: ["", ""],
  })

  const [polls, setPolls] = useState([
    {
      id: "1",
      question: "Which topic would you like to cover next?",
      options: [
        { id: "1", text: "React Server Components", votes: 12 },
        { id: "2", text: "Next.js App Router", votes: 8 },
        { id: "3", text: "Tailwind CSS", votes: 5 },
      ],
      totalVotes: 25,
      isActive: false,
    },
    {
      id: "2",
      question: "How is the pace of the class?",
      options: [
        { id: "1", text: "Too slow", votes: 3 },
        { id: "2", text: "Just right", votes: 15 },
        { id: "3", text: "Too fast", votes: 7 },
      ],
      totalVotes: 25,
      isActive: false,
    },
  ])

  const [activePoll, setActivePoll] = useState(null)

  const handleAddOption = () => {
    setNewPoll({
      ...newPoll,
      options: [...newPoll.options, ""],
    })
  }

  const handleRemoveOption = (index) => {
    if (newPoll.options.length <= 2) return

    const updatedOptions = [...newPoll.options]
    updatedOptions.splice(index, 1)

    setNewPoll({
      ...newPoll,
      options: updatedOptions,
    })
  }

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newPoll.options]
    updatedOptions[index] = value

    setNewPoll({
      ...newPoll,
      options: updatedOptions,
    })
  }

  const handleCreatePoll = () => {
    if (!newPoll.question.trim() || newPoll.options.some((opt) => !opt.trim())) {
     toast.error("Please fill in all fields");
      return
    }

    const newPollObj = {
      id: Date.now().toString(),
      question: newPoll.question,
      options: newPoll.options.map((opt, i) => ({
        id: i.toString(),
        text: opt,
        votes: 0,
      })),
      totalVotes: 0,
      isActive: false,
    }

    setPolls([...polls, newPollObj])
    setNewPoll({
      question: "",
      options: ["", ""],
    })
    setIsCreating(false)

    toast({
      title: "Poll created",
      description: "Your poll has been created successfully",
    })
  }

  const handleStartPoll = (poll) => {
    // Deactivate any active poll
    const updatedPolls = polls.map((p) => ({
      ...p,
      isActive: false,
    }))

    // Set the selected poll as active
    const pollIndex = updatedPolls.findIndex((p) => p.id === poll.id)
    if (pollIndex !== -1) {
      updatedPolls[pollIndex].isActive = true
    }

    setPolls(updatedPolls)
    setActivePoll({ ...poll, isActive: true })
    setIsCreating(false)

    toast({
      title: "Poll started",
      description: "Your poll is now active",
    })
  }

  const handleVote = () => {
    if (!activePoll || !selectedOption) return

    const updatedPolls = polls.map((poll) => {
      if (poll.id === activePoll.id) {
        const updatedOptions = poll.options.map((opt) => {
          if (opt.id === selectedOption) {
            return { ...opt, votes: opt.votes + 1 }
          }
          return opt
        })

        return {
          ...poll,
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1,
        }
      }
      return poll
    })

    setPolls(updatedPolls)
    setSelectedOption("")

    // Update active poll
    const updatedActivePoll = updatedPolls.find((p) => p.id === activePoll.id)
    if (updatedActivePoll) {
      setActivePoll(updatedActivePoll)
    }

    toast({
      title: "Vote recorded",
      description: "Your vote has been recorded",
    })
  }

  if (isAdmin && isCreating) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Create New Poll</CardTitle>
            <CardDescription>Add a question and options</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                placeholder="Enter your question"
                value={newPoll.question}
                onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              {newPoll.options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                    disabled={newPoll.options.length <= 2}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button variant="outline" size="sm" onClick={handleAddOption} className="mt-2">
                Add Option
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsCreating(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreatePoll}>Create Poll</Button>
        </CardFooter>
      </Card>
    )
  }

  if (isAdmin && !activePoll) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Polls</CardTitle>
            <CardDescription>Start a poll or create a new one</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {polls.map((poll) => (
              <div key={poll.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{poll.question}</p>
                  <p className="text-sm text-muted-foreground">{poll.totalVotes} votes</p>
                </div>
                <Button size="sm" onClick={() => handleStartPoll(poll)}>
                  Start
                </Button>
              </div>
            ))}

            {polls.length === 0 && <p className="text-center text-muted-foreground py-4">No polls available</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setIsCreating(true)}>
            Create New Poll
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Active poll view (for both admin and users)
  if (activePoll) {
    const totalVotes = activePoll.totalVotes

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Poll</CardTitle>
            <CardDescription>{activePoll.question}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            {activePoll.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 mb-4">
                <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                <div className="flex-1">
                  <Label htmlFor={`option-${option.id}`} className="flex justify-between">
                    <span>{option.text}</span>
                    <span className="text-muted-foreground">{option.votes} votes</span>
                  </Label>
                  <div className="w-full h-2 bg-muted rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: totalVotes > 0 ? `${(option.votes / totalVotes) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>

          <div className="text-sm text-muted-foreground text-right mt-2">Total votes: {totalVotes}</div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isAdmin ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setActivePoll(null)
                const updatedPolls = polls.map((p) => ({
                  ...p,
                  isActive: false,
                }))
                setPolls(updatedPolls)
              }}
            >
              End Poll
            </Button>
          ) : (
            <Button className="w-full" disabled={!selectedOption} onClick={handleVote}>
              Vote
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  // User view when no active poll
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Polls</CardTitle>
          <CardDescription>No active polls at the moment</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-8">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">The instructor hasn't started any polls yet</p>
        </div>
      </CardContent>
    </Card>
  )
}
