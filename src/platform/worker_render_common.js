'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var message_bus_1 = require('angular2/src/web_workers/shared/message_bus');
var ng_zone_1 = require('angular2/src/core/zone/ng_zone');
var core_1 = require('angular2/core');
var common_dom_1 = require('angular2/platform/common_dom');
var di_1 = require('angular2/src/core/di');
// TODO change these imports once dom_adapter is moved out of core
var dom_adapter_1 = require('angular2/src/platform/dom/dom_adapter');
var dom_events_1 = require('angular2/src/platform/dom/events/dom_events');
var key_events_1 = require('angular2/src/platform/dom/events/key_events');
var hammer_gestures_1 = require('angular2/src/platform/dom/events/hammer_gestures');
var dom_tokens_1 = require('angular2/src/platform/dom/dom_tokens');
var dom_renderer_1 = require('angular2/src/platform/dom/dom_renderer');
var shared_styles_host_1 = require('angular2/src/platform/dom/shared_styles_host');
var shared_styles_host_2 = require("angular2/src/platform/dom/shared_styles_host");
var browser_details_1 = require('angular2/src/animate/browser_details');
var animation_builder_1 = require('angular2/src/animate/animation_builder');
var compiler_1 = require('angular2/compiler');
var xhr_impl_1 = require('angular2/src/platform/browser/xhr_impl');
var testability_1 = require('angular2/src/core/testability/testability');
var testability_2 = require('angular2/src/platform/browser/testability');
var browser_adapter_1 = require('./browser/browser_adapter');
var wtf_init_1 = require('angular2/src/core/profile/wtf_init');
var renderer_1 = require('angular2/src/web_workers/ui/renderer');
var xhr_impl_2 = require('angular2/src/web_workers/ui/xhr_impl');
var service_message_broker_1 = require('angular2/src/web_workers/shared/service_message_broker');
var client_message_broker_1 = require('angular2/src/web_workers/shared/client_message_broker');
var browser_platform_location_1 = require('angular2/src/platform/browser/location/browser_platform_location');
var serializer_1 = require('angular2/src/web_workers/shared/serializer');
var api_1 = require('angular2/src/web_workers/shared/api');
var render_store_1 = require('angular2/src/web_workers/shared/render_store');
var hammer_gestures_2 = require('./dom/events/hammer_gestures');
exports.WORKER_SCRIPT = lang_1.CONST_EXPR(new di_1.OpaqueToken("WebWorkerScript"));
// Message based Worker classes that listen on the MessageBus
exports.WORKER_RENDER_MESSAGING_PROVIDERS = lang_1.CONST_EXPR([renderer_1.MessageBasedRenderer, xhr_impl_2.MessageBasedXHRImpl]);
exports.WORKER_RENDER_PLATFORM_MARKER = lang_1.CONST_EXPR(new di_1.OpaqueToken('WorkerRenderPlatformMarker'));
exports.WORKER_RENDER_PLATFORM = lang_1.CONST_EXPR([
    core_1.PLATFORM_COMMON_PROVIDERS,
    lang_1.CONST_EXPR(new di_1.Provider(exports.WORKER_RENDER_PLATFORM_MARKER, { useValue: true })),
    new di_1.Provider(core_1.PLATFORM_INITIALIZER, { useValue: initWebWorkerRenderPlatform, multi: true })
]);
/**
 * A list of {@link Provider}s. To use the router in a Worker enabled application you must
 * include these providers when setting up the render thread.
 */
exports.WORKER_RENDER_ROUTER = lang_1.CONST_EXPR([browser_platform_location_1.BrowserPlatformLocation]);
exports.WORKER_RENDER_APPLICATION_COMMON = lang_1.CONST_EXPR([
    core_1.APPLICATION_COMMON_PROVIDERS,
    exports.WORKER_RENDER_MESSAGING_PROVIDERS,
    new di_1.Provider(core_1.ExceptionHandler, { useFactory: _exceptionHandler, deps: [] }),
    new di_1.Provider(dom_tokens_1.DOCUMENT, { useFactory: _document, deps: [] }),
    // TODO(jteplitz602): Investigate if we definitely need EVENT_MANAGER on the render thread
    // #5298
    new di_1.Provider(common_dom_1.EVENT_MANAGER_PLUGINS, { useClass: dom_events_1.DomEventsPlugin, multi: true }),
    new di_1.Provider(common_dom_1.EVENT_MANAGER_PLUGINS, { useClass: key_events_1.KeyEventsPlugin, multi: true }),
    new di_1.Provider(common_dom_1.EVENT_MANAGER_PLUGINS, { useClass: hammer_gestures_1.HammerGesturesPlugin, multi: true }),
    new di_1.Provider(hammer_gestures_2.HAMMER_GESTURE_CONFIG, { useClass: hammer_gestures_2.HammerGestureConfig }),
    new di_1.Provider(dom_renderer_1.DomRootRenderer, { useClass: dom_renderer_1.DomRootRenderer_ }),
    new di_1.Provider(core_1.RootRenderer, { useExisting: dom_renderer_1.DomRootRenderer }),
    new di_1.Provider(shared_styles_host_2.SharedStylesHost, { useExisting: shared_styles_host_1.DomSharedStylesHost }),
    new di_1.Provider(compiler_1.XHR, { useClass: xhr_impl_1.XHRImpl }),
    xhr_impl_2.MessageBasedXHRImpl,
    new di_1.Provider(service_message_broker_1.ServiceMessageBrokerFactory, { useClass: service_message_broker_1.ServiceMessageBrokerFactory_ }),
    new di_1.Provider(client_message_broker_1.ClientMessageBrokerFactory, { useClass: client_message_broker_1.ClientMessageBrokerFactory_ }),
    serializer_1.Serializer,
    new di_1.Provider(api_1.ON_WEB_WORKER, { useValue: false }),
    render_store_1.RenderStore,
    shared_styles_host_1.DomSharedStylesHost,
    testability_1.Testability,
    browser_details_1.BrowserDetails,
    animation_builder_1.AnimationBuilder,
    common_dom_1.EventManager
]);
function initializeGenericWorkerRenderer(injector) {
    var bus = injector.get(message_bus_1.MessageBus);
    var zone = injector.get(ng_zone_1.NgZone);
    bus.attachToZone(zone);
    zone.runGuarded(function () {
        exports.WORKER_RENDER_MESSAGING_PROVIDERS.forEach(function (token) { injector.get(token).start(); });
    });
}
exports.initializeGenericWorkerRenderer = initializeGenericWorkerRenderer;
function initWebWorkerRenderPlatform() {
    browser_adapter_1.BrowserDomAdapter.makeCurrent();
    wtf_init_1.wtfInit();
    testability_2.BrowserGetTestability.init();
}
exports.initWebWorkerRenderPlatform = initWebWorkerRenderPlatform;
function _exceptionHandler() {
    return new core_1.ExceptionHandler(dom_adapter_1.DOM, !lang_1.IS_DART);
}
function _document() {
    return dom_adapter_1.DOM.defaultDoc();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyX3JlbmRlcl9jb21tb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTlReFR3eVE2LnRtcC9hbmd1bGFyMi9zcmMvcGxhdGZvcm0vd29ya2VyX3JlbmRlcl9jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUFrQywwQkFBMEIsQ0FBQyxDQUFBO0FBQzdELDRCQUF5Qiw2Q0FBNkMsQ0FBQyxDQUFBO0FBQ3ZFLHdCQUFxQixnQ0FBZ0MsQ0FBQyxDQUFBO0FBQ3RELHFCQVlPLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZCLDJCQUFrRCw4QkFBOEIsQ0FBQyxDQUFBO0FBQ2pGLG1CQUF1RCxzQkFBc0IsQ0FBQyxDQUFBO0FBQzlFLGtFQUFrRTtBQUNsRSw0QkFBa0IsdUNBQXVDLENBQUMsQ0FBQTtBQUMxRCwyQkFBOEIsNkNBQTZDLENBQUMsQ0FBQTtBQUM1RSwyQkFBOEIsNkNBQTZDLENBQUMsQ0FBQTtBQUM1RSxnQ0FBbUMsa0RBQWtELENBQUMsQ0FBQTtBQUN0RiwyQkFBdUIsc0NBQXNDLENBQUMsQ0FBQTtBQUM5RCw2QkFBZ0Qsd0NBQXdDLENBQUMsQ0FBQTtBQUN6RixtQ0FBa0MsOENBQThDLENBQUMsQ0FBQTtBQUNqRixtQ0FBK0IsOENBQThDLENBQUMsQ0FBQTtBQUM5RSxnQ0FBNkIsc0NBQXNDLENBQUMsQ0FBQTtBQUNwRSxrQ0FBK0Isd0NBQXdDLENBQUMsQ0FBQTtBQUN4RSx5QkFBa0IsbUJBQW1CLENBQUMsQ0FBQTtBQUN0Qyx5QkFBc0Isd0NBQXdDLENBQUMsQ0FBQTtBQUMvRCw0QkFBMEIsMkNBQTJDLENBQUMsQ0FBQTtBQUN0RSw0QkFBb0MsMkNBQTJDLENBQUMsQ0FBQTtBQUNoRixnQ0FBZ0MsMkJBQTJCLENBQUMsQ0FBQTtBQUM1RCx5QkFBc0Isb0NBQW9DLENBQUMsQ0FBQTtBQUMzRCx5QkFBbUMsc0NBQXNDLENBQUMsQ0FBQTtBQUMxRSx5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Qix5QkFBVztJQUNYLGdDQUFjO0lBQ2Qsb0NBQWdCO0lBQ2hCLHlCQUFZO0NBQ2IsQ0FBQyxDQUFDO0FBRUgseUNBQWdELFFBQWtCO0lBQ2hFLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsd0JBQVUsQ0FBQyxDQUFDO0lBQ25DLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQU0sQ0FBQyxDQUFDO0lBQ2hDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNkLHlDQUFpQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssSUFBTyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekYsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBUmUsdUNBQStCLGtDQVE5QyxDQUFBO0FBRUQ7SUFDRSxtQ0FBaUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNoQyxrQkFBTyxFQUFFLENBQUM7SUFDVixtQ0FBcUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvQixDQUFDO0FBSmUsbUNBQTJCLDhCQUkxQyxDQUFBO0FBRUQ7SUFDRSxNQUFNLENBQUMsSUFBSSx1QkFBZ0IsQ0FBQyxpQkFBRyxFQUFFLENBQUMsY0FBTyxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUVEO0lBQ0UsTUFBTSxDQUFDLGlCQUFHLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDMUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q09OU1RfRVhQUiwgSVNfREFSVH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TWVzc2FnZUJ1c30gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9tZXNzYWdlX2J1cyc7XG5pbXBvcnQge05nWm9uZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvem9uZS9uZ196b25lJztcbmltcG9ydCB7XG4gIFBMQVRGT1JNX0RJUkVDVElWRVMsXG4gIFBMQVRGT1JNX1BJUEVTLFxuICBDb21wb25lbnRSZWYsXG4gIEV4Y2VwdGlvbkhhbmRsZXIsXG4gIFJlZmxlY3RvcixcbiAgcmVmbGVjdG9yLFxuICBBUFBMSUNBVElPTl9DT01NT05fUFJPVklERVJTLFxuICBQTEFURk9STV9DT01NT05fUFJPVklERVJTLFxuICBSb290UmVuZGVyZXIsXG4gIFBMQVRGT1JNX0lOSVRJQUxJWkVSLFxuICBBUFBfSU5JVElBTElaRVJcbn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge0VWRU5UX01BTkFHRVJfUExVR0lOUywgRXZlbnRNYW5hZ2VyfSBmcm9tICdhbmd1bGFyMi9wbGF0Zm9ybS9jb21tb25fZG9tJztcbmltcG9ydCB7cHJvdmlkZSwgUHJvdmlkZXIsIEluamVjdG9yLCBPcGFxdWVUb2tlbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuLy8gVE9ETyBjaGFuZ2UgdGhlc2UgaW1wb3J0cyBvbmNlIGRvbV9hZGFwdGVyIGlzIG1vdmVkIG91dCBvZiBjb3JlXG5pbXBvcnQge0RPTX0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kb21fYWRhcHRlcic7XG5pbXBvcnQge0RvbUV2ZW50c1BsdWdpbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9ldmVudHMvZG9tX2V2ZW50cyc7XG5pbXBvcnQge0tleUV2ZW50c1BsdWdpbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9ldmVudHMva2V5X2V2ZW50cyc7XG5pbXBvcnQge0hhbW1lckdlc3R1cmVzUGx1Z2lufSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2V2ZW50cy9oYW1tZXJfZ2VzdHVyZXMnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kb21fdG9rZW5zJztcbmltcG9ydCB7RG9tUm9vdFJlbmRlcmVyLCBEb21Sb290UmVuZGVyZXJffSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV9yZW5kZXJlcic7XG5pbXBvcnQge0RvbVNoYXJlZFN0eWxlc0hvc3R9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vc2hhcmVkX3N0eWxlc19ob3N0JztcbmltcG9ydCB7U2hhcmVkU3R5bGVzSG9zdH0gZnJvbSBcImFuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vc2hhcmVkX3N0eWxlc19ob3N0XCI7XG5pbXBvcnQge0Jyb3dzZXJEZXRhaWxzfSBmcm9tICdhbmd1bGFyMi9zcmMvYW5pbWF0ZS9icm93c2VyX2RldGFpbHMnO1xuaW1wb3J0IHtBbmltYXRpb25CdWlsZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvYW5pbWF0ZS9hbmltYXRpb25fYnVpbGRlcic7XG5pbXBvcnQge1hIUn0gZnJvbSAnYW5ndWxhcjIvY29tcGlsZXInO1xuaW1wb3J0IHtYSFJJbXBsfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlci94aHJfaW1wbCc7XG5pbXBvcnQge1Rlc3RhYmlsaXR5fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS90ZXN0YWJpbGl0eS90ZXN0YWJpbGl0eSc7XG5pbXBvcnQge0Jyb3dzZXJHZXRUZXN0YWJpbGl0eX0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2Jyb3dzZXIvdGVzdGFiaWxpdHknO1xuaW1wb3J0IHtCcm93c2VyRG9tQWRhcHRlcn0gZnJvbSAnLi9icm93c2VyL2Jyb3dzZXJfYWRhcHRlcic7XG5pbXBvcnQge3d0ZkluaXR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3Byb2ZpbGUvd3RmX2luaXQnO1xuaW1wb3J0IHtNZXNzYWdlQmFzZWRSZW5kZXJlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3VpL3JlbmRlcmVyJztcbmltcG9ydCB7TWVzc2FnZUJhc2VkWEhSSW1wbH0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3VpL3hocl9pbXBsJztcbmltcG9ydCB7XG4gIFNlcnZpY2VNZXNzYWdlQnJva2VyRmFjdG9yeSxcbiAgU2VydmljZU1lc3NhZ2VCcm9rZXJGYWN0b3J5X1xufSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL3NlcnZpY2VfbWVzc2FnZV9icm9rZXInO1xuaW1wb3J0IHtcbiAgQ2xpZW50TWVzc2FnZUJyb2tlckZhY3RvcnksXG4gIENsaWVudE1lc3NhZ2VCcm9rZXJGYWN0b3J5X1xufSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL2NsaWVudF9tZXNzYWdlX2Jyb2tlcic7XG5pbXBvcnQge1xuICBCcm93c2VyUGxhdGZvcm1Mb2NhdGlvblxufSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlci9sb2NhdGlvbi9icm93c2VyX3BsYXRmb3JtX2xvY2F0aW9uJztcbmltcG9ydCB7U2VyaWFsaXplcn0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9zZXJpYWxpemVyJztcbmltcG9ydCB7T05fV0VCX1dPUktFUn0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9hcGknO1xuaW1wb3J0IHtSZW5kZXJTdG9yZX0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9yZW5kZXJfc3RvcmUnO1xuaW1wb3J0IHtIQU1NRVJfR0VTVFVSRV9DT05GSUcsIEhhbW1lckdlc3R1cmVDb25maWd9IGZyb20gJy4vZG9tL2V2ZW50cy9oYW1tZXJfZ2VzdHVyZXMnO1xuXG5leHBvcnQgY29uc3QgV09SS0VSX1NDUklQVDogT3BhcXVlVG9rZW4gPSBDT05TVF9FWFBSKG5ldyBPcGFxdWVUb2tlbihcIldlYldvcmtlclNjcmlwdFwiKSk7XG5cbi8vIE1lc3NhZ2UgYmFzZWQgV29ya2VyIGNsYXNzZXMgdGhhdCBsaXN0ZW4gb24gdGhlIE1lc3NhZ2VCdXNcbmV4cG9ydCBjb25zdCBXT1JLRVJfUkVOREVSX01FU1NBR0lOR19QUk9WSURFUlM6IEFycmF5PGFueSAvKlR5cGUgfCBQcm92aWRlciB8IGFueVtdKi8+ID1cbiAgICBDT05TVF9FWFBSKFtNZXNzYWdlQmFzZWRSZW5kZXJlciwgTWVzc2FnZUJhc2VkWEhSSW1wbF0pO1xuXG5leHBvcnQgY29uc3QgV09SS0VSX1JFTkRFUl9QTEFURk9STV9NQVJLRVIgPVxuICAgIENPTlNUX0VYUFIobmV3IE9wYXF1ZVRva2VuKCdXb3JrZXJSZW5kZXJQbGF0Zm9ybU1hcmtlcicpKTtcblxuZXhwb3J0IGNvbnN0IFdPUktFUl9SRU5ERVJfUExBVEZPUk06IEFycmF5PGFueSAvKlR5cGUgfCBQcm92aWRlciB8IGFueVtdKi8+ID0gQ09OU1RfRVhQUihbXG4gIFBMQVRGT1JNX0NPTU1PTl9QUk9WSURFUlMsXG4gIENPTlNUX0VYUFIobmV3IFByb3ZpZGVyKFdPUktFUl9SRU5ERVJfUExBVEZPUk1fTUFSS0VSLCB7dXNlVmFsdWU6IHRydWV9KSksXG4gIG5ldyBQcm92aWRlcihQTEFURk9STV9JTklUSUFMSVpFUiwge3VzZVZhbHVlOiBpbml0V2ViV29ya2VyUmVuZGVyUGxhdGZvcm0sIG11bHRpOiB0cnVlfSlcbl0pO1xuXG4vKipcbiAqIEEgbGlzdCBvZiB7QGxpbmsgUHJvdmlkZXJ9cy4gVG8gdXNlIHRoZSByb3V0ZXIgaW4gYSBXb3JrZXIgZW5hYmxlZCBhcHBsaWNhdGlvbiB5b3UgbXVzdFxuICogaW5jbHVkZSB0aGVzZSBwcm92aWRlcnMgd2hlbiBzZXR0aW5nIHVwIHRoZSByZW5kZXIgdGhyZWFkLlxuICovXG5leHBvcnQgY29uc3QgV09SS0VSX1JFTkRFUl9ST1VURVI6IEFycmF5PGFueSAvKlR5cGUgfCBQcm92aWRlciB8IGFueVtdKi8+ID1cbiAgICBDT05TVF9FWFBSKFtCcm93c2VyUGxhdGZvcm1Mb2NhdGlvbl0pO1xuXG5leHBvcnQgY29uc3QgV09SS0VSX1JFTkRFUl9BUFBMSUNBVElPTl9DT01NT046IEFycmF5PGFueSAvKlR5cGUgfCBQcm92aWRlciB8IGFueVtdKi8+ID0gQ09OU1RfRVhQUihbXG4gIEFQUExJQ0FUSU9OX0NPTU1PTl9QUk9WSURFUlMsXG4gIFdPUktFUl9SRU5ERVJfTUVTU0FHSU5HX1BST1ZJREVSUyxcbiAgbmV3IFByb3ZpZGVyKEV4Y2VwdGlvbkhhbmRsZXIsIHt1c2VGYWN0b3J5OiBfZXhjZXB0aW9uSGFuZGxlciwgZGVwczogW119KSxcbiAgbmV3IFByb3ZpZGVyKERPQ1VNRU5ULCB7dXNlRmFjdG9yeTogX2RvY3VtZW50LCBkZXBzOiBbXX0pLFxuICAvLyBUT0RPKGp0ZXBsaXR6NjAyKTogSW52ZXN0aWdhdGUgaWYgd2UgZGVmaW5pdGVseSBuZWVkIEVWRU5UX01BTkFHRVIgb24gdGhlIHJlbmRlciB0aHJlYWRcbiAgLy8gIzUyOThcbiAgbmV3IFByb3ZpZGVyKEVWRU5UX01BTkFHRVJfUExVR0lOUywge3VzZUNsYXNzOiBEb21FdmVudHNQbHVnaW4sIG11bHRpOiB0cnVlfSksXG4gIG5ldyBQcm92aWRlcihFVkVOVF9NQU5BR0VSX1BMVUdJTlMsIHt1c2VDbGFzczogS2V5RXZlbnRzUGx1Z2luLCBtdWx0aTogdHJ1ZX0pLFxuICBuZXcgUHJvdmlkZXIoRVZFTlRfTUFOQUdFUl9QTFVHSU5TLCB7dXNlQ2xhc3M6IEhhbW1lckdlc3R1cmVzUGx1Z2luLCBtdWx0aTogdHJ1ZX0pLFxuICBuZXcgUHJvdmlkZXIoSEFNTUVSX0dFU1RVUkVfQ09ORklHLCB7dXNlQ2xhc3M6IEhhbW1lckdlc3R1cmVDb25maWd9KSxcbiAgbmV3IFByb3ZpZGVyKERvbVJvb3RSZW5kZXJlciwge3VzZUNsYXNzOiBEb21Sb290UmVuZGVyZXJffSksXG4gIG5ldyBQcm92aWRlcihSb290UmVuZGVyZXIsIHt1c2VFeGlzdGluZzogRG9tUm9vdFJlbmRlcmVyfSksXG4gIG5ldyBQcm92aWRlcihTaGFyZWRTdHlsZXNIb3N0LCB7dXNlRXhpc3Rpbmc6IERvbVNoYXJlZFN0eWxlc0hvc3R9KSxcbiAgbmV3IFByb3ZpZGVyKFhIUiwge3VzZUNsYXNzOiBYSFJJbXBsfSksXG4gIE1lc3NhZ2VCYXNlZFhIUkltcGwsXG4gIG5ldyBQcm92aWRlcihTZXJ2aWNlTWVzc2FnZUJyb2tlckZhY3RvcnksIHt1c2VDbGFzczogU2VydmljZU1lc3NhZ2VCcm9rZXJGYWN0b3J5X30pLFxuICBuZXcgUHJvdmlkZXIoQ2xpZW50TWVzc2FnZUJyb2tlckZhY3RvcnksIHt1c2VDbGFzczogQ2xpZW50TWVzc2FnZUJyb2tlckZhY3RvcnlffSksXG4gIFNlcmlhbGl6ZXIsXG4gIG5ldyBQcm92aWRlcihPTl9XRUJfV09SS0VSLCB7dXNlVmFsdWU6IGZhbHNlfSksXG4gIFJlbmRlclN0b3JlLFxuICBEb21TaGFyZWRTdHlsZXNIb3N0LFxuICBUZXN0YWJpbGl0eSxcbiAgQnJvd3NlckRldGFpbHMsXG4gIEFuaW1hdGlvbkJ1aWxkZXIsXG4gIEV2ZW50TWFuYWdlclxuXSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplR2VuZXJpY1dvcmtlclJlbmRlcmVyKGluamVjdG9yOiBJbmplY3Rvcikge1xuICB2YXIgYnVzID0gaW5qZWN0b3IuZ2V0KE1lc3NhZ2VCdXMpO1xuICBsZXQgem9uZSA9IGluamVjdG9yLmdldChOZ1pvbmUpO1xuICBidXMuYXR0YWNoVG9ab25lKHpvbmUpO1xuXG4gIHpvbmUucnVuR3VhcmRlZCgoKSA9PiB7XG4gICAgV09SS0VSX1JFTkRFUl9NRVNTQUdJTkdfUFJPVklERVJTLmZvckVhY2goKHRva2VuKSA9PiB7IGluamVjdG9yLmdldCh0b2tlbikuc3RhcnQoKTsgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdFdlYldvcmtlclJlbmRlclBsYXRmb3JtKCk6IHZvaWQge1xuICBCcm93c2VyRG9tQWRhcHRlci5tYWtlQ3VycmVudCgpO1xuICB3dGZJbml0KCk7XG4gIEJyb3dzZXJHZXRUZXN0YWJpbGl0eS5pbml0KCk7XG59XG5cbmZ1bmN0aW9uIF9leGNlcHRpb25IYW5kbGVyKCk6IEV4Y2VwdGlvbkhhbmRsZXIge1xuICByZXR1cm4gbmV3IEV4Y2VwdGlvbkhhbmRsZXIoRE9NLCAhSVNfREFSVCk7XG59XG5cbmZ1bmN0aW9uIF9kb2N1bWVudCgpOiBhbnkge1xuICByZXR1cm4gRE9NLmRlZmF1bHREb2MoKTtcbn1cbiJdfQ==