export const createProcessZoneRoute = (
  processName,
  routeName,
  component = null,
) => ({
  path: routeName.toLowerCase(),
  name: `wms${routeName}Zone`,
  component: () => import("@/views/Home/WMS/Process/ProcessZones.vue"),
  props: { process: processName, processRouteName: `wms${routeName}` },
  meta: {
    breadcrumb: {
      text: processName,
      textOnly: true,
    },
  },
  children: component
    ? [
        {
          path: ":code",
          name: `wms${routeName}`,
          component: () => import(component),
          meta: {
            breadcrumb: {
              text: "Зона",
              textOnly: true,
            },
          },
          children: [
            {
              path: "tsd/",
              name: "TTM-Terminal",
              component: () =>
                import(
                  "@/components/TeplomashTaskManager/Terminal/TTMTerminal.vue"
                ),
              meta: {
                breadcrumb: {
                  text: "ТСД",
                  textOnly: true,
                },
              },
              props: true,
            },
          ],
        },
      ]
    : [],
});
