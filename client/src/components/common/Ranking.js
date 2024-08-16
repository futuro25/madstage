import { Star } from 'lucide-react';
import { range } from "lodash";

export default function Ranking ({ranking}){
  return (
    <div className="flex mt-1">
      {
        range(ranking).map((star, index) => (
          <Star key={index} className="w-4 h-4 text-yellow-500" />
        ))
      }
      {
        range(ranking, 5).map((star, index) => (
          <Star key={index} className="w-4 h-4" />
        ))
      }
    </div>
    )
}