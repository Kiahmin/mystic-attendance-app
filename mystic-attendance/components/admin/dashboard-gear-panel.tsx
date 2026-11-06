import Link from "next/link";
import { gearOrderItemLabel } from "@/lib/gear-utils";
import type { GearDashboard } from "@/lib/queries/student-gear";
import {
  GearOrderStatusButtons,
  MarkGearGivenButton,
} from "@/components/gear/gear-order-controls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

export function DashboardGearPanel({ gear }: { gear: GearDashboard }) {
  const bringCount = gear.bringToday.reduce(
    (sum, session) => sum + session.students.length,
    0
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <h3 className="font-heading text-base leading-snug font-medium">
            Bring today
          </h3>
          <CardDescription>
            Rentals and items ready to hand over for today's classes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bringCount === 0 ? (
            <EmptyState
              title="Nothing to bring"
              description="No one expected today needs a rental or a ready item."
            />
          ) : (
            <div className="max-h-96 space-y-5 overflow-y-auto overscroll-contain">
              {gear.bringToday.map((session) => (
                <section key={session.sessionId} className="space-y-2">
                  <h3 className="text-sm font-medium">
                    <Link
                      href={session.href}
                      className="underline-offset-4 hover:underline"
                    >
                      {session.timeLabel} · {session.title}
                    </Link>
                    {session.venueName ? (
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        · {session.venueName}
                      </span>
                    ) : null}
                  </h3>
                  <ul className="divide-y">
                    {session.students.map((student) => (
                      <li key={student.studentId} className="py-2">
                        <Link
                          href={`/admin/students/${student.studentId}`}
                          className="font-medium underline-offset-4 hover:underline"
                        >
                          {student.fullName}
                        </Link>
                        {student.rentalLine ? (
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {student.rentalLine}
                          </p>
                        ) : null}
                        {student.readyOrders.map((order) => (
                          <div
                            key={order.id}
                            className="mt-1.5 flex items-center justify-between gap-3"
                          >
                            <p className="text-sm">
                              {gearOrderItemLabel(order)} — Ready to bring
                            </p>
                            <MarkGearGivenButton
                              orderId={order.id}
                              itemLabel={gearOrderItemLabel(order)}
                              studentName={student.fullName}
                              sessionId={session.sessionId}
                            />
                          </div>
                        ))}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-heading text-base leading-snug font-medium">
            Open orders
          </h3>
          <CardDescription>
            Purchases still to order or on the way, plus ready items for
            students who are not in class today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {gear.openOrders.length === 0 ? (
            <EmptyState
              title="No open orders"
              description="Purchases marked ready for today's classes are listed under Bring today."
            />
          ) : (
            <ul className="max-h-96 divide-y overflow-y-auto overscroll-contain">
              {gear.openOrders.map(({ order, studentName }) => (
                <li key={order.id} className="flex flex-col gap-2 py-3">
                  <div>
                    <Link
                      href={`/admin/students/${order.student_id}`}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {studentName}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {gearOrderItemLabel(order)}
                      {order.notes ? ` · ${order.notes}` : ""}
                    </p>
                  </div>
                  <GearOrderStatusButtons
                    orderId={order.id}
                    status={order.status}
                    itemLabel={gearOrderItemLabel(order)}
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      role="status"
      className="flex items-center justify-center rounded-lg border border-dashed p-4 text-center"
    >
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
