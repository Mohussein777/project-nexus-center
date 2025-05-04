
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PersonalStats() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">الإحصائيات الشخصية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">معدل العمل اليومي</span>
            <span className="font-medium">8:00 ساعة</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">إجمالي ساعات هذا الأسبوع</span>
            <span className="font-medium">32:45 ساعة</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">إجمالي ساعات هذا الشهر</span>
            <span className="font-medium">120:30 ساعة</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
