import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Users, Clock } from 'lucide-react';

export function CourseAddCard({ id, title, description, price, image, seats, duration, onEdit, onDelete,open,setOpen }) {
  return (
    <Card className="w-full">
      <CardHeader className="p-0">
        <div className="relative">
          <img src={image} alt={title} className="w-full h-48 object-cover rounded-t-lg" />
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
          ₹{price.toFixed(2)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-xl font-bold mb-2">{title}</CardTitle>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{seats} seats</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{duration}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="outline" size="sm" onClick={() =>{ onEdit(id)
        }}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(id)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

