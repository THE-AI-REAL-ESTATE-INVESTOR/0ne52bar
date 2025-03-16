import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const merchItems = [
  { name: "Hoodie", price: "$45", image: "/hoodie.png" },
  { name: "Shirt", price: "$25", image: "/shirt.png" },
  { name: "Coozie", price: "$5", image: "/coozie.png" },
];

export default function MerchDisplay() {
  const [selectedItem, setSelectedItem] = useState(merchItems[0]);

  return (
    <div className="flex flex-col items-center p-4 space-y-6">
      <h1 className="text-2xl font-bold">One-52 Bar Merch</h1>
      <div className="flex space-x-4">
        {merchItems.map((item) => (
          <Button key={item.name} onClick={() => setSelectedItem(item)}>
            {item.name}
          </Button>
        ))}
      </div>
      <Card className="w-80 text-center">
        <CardHeader>
          <CardTitle>{selectedItem.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-48 object-cover rounded" />
          <p className="mt-2 text-lg font-semibold">{selectedItem.price}</p>
        </CardContent>
      </Card>
    </div>
  );
}
